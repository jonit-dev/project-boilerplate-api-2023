/* eslint-disable no-void */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { MapControlTimeModel } from "@entities/ModuleSystem/MapControlTimeModel";
import { BattleNetworkStopTargeting } from "@providers/battle/network/BattleNetworkStopTargetting";
import { appEnv } from "@providers/config/env";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { ItemView } from "@providers/item/ItemView";
import { GridManager } from "@providers/map/GridManager";
import { NPCManager } from "@providers/npc/NPCManager";
import { NPCWarn } from "@providers/npc/NPCWarn";
import { PM2Helper } from "@providers/server/PM2Helper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { NamespaceRedisControl } from "@providers/spells/data/types/SpellsBlueprintTypes";
import {
  AnimationDirection,
  AvailableWeather,
  CharacterClass,
  CharacterSocketEvents,
  EnvType,
  ICharacterCreateFromClient,
  ICharacterCreateFromServer,
  IControlTime,
  PeriodOfDay,
  SpellsBlueprint,
  ToGridX,
  ToGridY,
  WeatherSocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterMonitor } from "../CharacterMonitor";
import { CharacterView } from "../CharacterView";

import { SocketSessionControl } from "@providers/sockets/SocketSessionControl";

import { BattleTargeting } from "@providers/battle/BattleTargeting";
import { ItemCleaner } from "@providers/item/ItemCleaner";
import { Locker } from "@providers/locks/Locker";
import { clearCacheForKey } from "speedgoose";
import { CharacterDeath } from "../CharacterDeath";
import { CharacterBuffValidation } from "../characterBuff/CharacterBuffValidation";
import { MagePassiveHabilities } from "../characterPassiveHabilities/MagePassiveHabilities";
import { WarriorPassiveHabilities } from "../characterPassiveHabilities/WarriorPassiveHabilities";

@provide(CharacterNetworkCreate)
export class CharacterNetworkCreate {
  constructor(
    private socketAuth: SocketAuth,
    private playerView: CharacterView,
    private socketMessaging: SocketMessaging,
    private itemView: ItemView,
    private battleNetworkStopTargeting: BattleNetworkStopTargeting,
    private npcManager: NPCManager,
    private gridManager: GridManager,
    private npcWarn: NPCWarn,
    private pm2Helper: PM2Helper,
    private characterView: CharacterView,
    private characterMonitor: CharacterMonitor,
    private specialEffect: SpecialEffect,
    private warriorPassiveHabilities: WarriorPassiveHabilities,
    private magePassiveHabilities: MagePassiveHabilities,
    private inMemoryHashTable: InMemoryHashTable,
    private socketSessionControl: SocketSessionControl,
    private characterDeath: CharacterDeath,
    private itemCleaner: ItemCleaner,
    private characterBuffValidation: CharacterBuffValidation,
    private battleTargeting: BattleTargeting,
    private locker: Locker
  ) {}

  public onCharacterCreate(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterSocketEvents.CharacterCreate,
      async (data: ICharacterCreateFromClient, connectionCharacter: ICharacter) => {
        await Character.findOneAndUpdate(
          { _id: connectionCharacter._id },
          {
            target: undefined,
            isOnline: true,
            channelId: data.channelId,
          }
        );

        let character = (await Character.findById(connectionCharacter._id)) as ICharacter;

        if (!character) {
          console.log(`🚫 ${connectionCharacter.name} tried to create its instance but it was not found!`);

          this.socketMessaging.sendEventToUser(data.channelId, CharacterSocketEvents.CharacterForceDisconnect, {
            reason: "Failed to find your character. Please contact the admin on discord.",
          });

          return;
        }

        await clearCacheForKey(`characterBuffs_${character._id}`);

        await this.characterView.clearCharacterView(character);

        await this.itemCleaner.clearMissingReferences(character);

        await this.inMemoryHashTable.delete("character-weapon", character._id);
        await this.locker.unlock(`character-changing-scene-${character._id}`);
        await this.locker.unlock(`character-death-${character.id}`);

        // refresh battle
        await this.locker.unlock(`character-${character._id}-battle-targeting`);
        await this.battleNetworkStopTargeting.stopTargeting(character);
        await this.battleTargeting.cancelTargeting(character);

        await this.characterBuffValidation.removeDuplicatedBuffs(character);

        const map = character.scene;

        await this.gridManager.setWalkable(map, ToGridX(character.x), ToGridY(character.y), false);

        const hasSession = await this.socketSessionControl.hasSession(character);

        if (hasSession) {
          console.log("Character already has a session in place! Clearing up!");
          await channel.leave(data.channelId);
          await this.socketSessionControl.deleteSession(character);
        }

        await this.socketSessionControl.setSession(character);

        await channel.join(data.channelId);

        if (character.isBanned) {
          console.log(`🚫 ${character.name} tried to create its instance while banned!`);

          this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.CharacterForceDisconnect, {
            reason: "You cannot use this character while banned.",
          });

          return;
        }

        if (!character.isAlive) {
          await this.characterDeath.respawnCharacter(character);

          character = (await Character.findById(connectionCharacter._id)) as ICharacter;
        }

        /*
        Here we inject our server side character properties, 
        to make sure the client is not hacking anything
        */

        const dataFromServer: ICharacterCreateFromServer = {
          ...data,
          id: character._id.toString(),
          name: character.name,
          x: character.x!,
          y: character.y!,
          direction: character.direction as AnimationDirection,
          layer: character.layer,
          speed: character.speed,
          movementIntervalMs: character.movementIntervalMs,
          health: character.health,
          maxHealth: character.maxHealth,
          mana: character.mana,
          maxMana: character.maxMana,
          textureKey: character.textureKey,
          alpha: await this.specialEffect.getOpacity(character),
        };

        switch (appEnv.general.ENV) {
          case EnvType.Development:
            void this.npcManager.startNearbyNPCsBehaviorLoop(character);

            break;
          case EnvType.Production: // This allocates a random CPU in charge of this NPC behavior in prod
            this.pm2Helper.sendEventToRandomCPUInstance("startNPCBehavior", {
              character,
            });
            break;
        }

        void this.npcWarn.warnCharacterAboutNPCsInView(character, { always: true });

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.itemView.warnCharacterAboutItemsInView(character, { always: true }); // dont await this because if there's a ton of garbage in the server, the character will be stuck waiting for this to finish

        await this.sendCreatedMessageToCharacterCreator(data.channelId, dataFromServer);

        await this.sendCreationMessageToCharacters(data.channelId, dataFromServer, character);

        await this.warnAboutWeatherStatus(character.channelId!);

        this.characterMonitor.watch(character, async (character: ICharacter) => {
          await this.handleCharacterRegen(character);
        });
      },
      false
    );
  }

  private sendCreatedMessageToCharacterCreator(channelId: string, dataFromServer: ICharacterCreateFromServer): void {
    this.socketMessaging.sendEventToUser<ICharacterCreateFromServer>(
      channelId,
      CharacterSocketEvents.CharacterCreate,
      dataFromServer
    );
  }

  public async sendCreationMessageToCharacters(
    emitterChannelId: string,
    dataFromServer: ICharacterCreateFromServer,
    character: ICharacter
  ): Promise<void> {
    const nearbyCharacters = await this.playerView.getCharactersInView(character);

    if (nearbyCharacters.length > 0) {
      for (const nearbyCharacter of nearbyCharacters) {
        // tell other character that we exist, so it can create a new instance of us
        this.socketMessaging.sendEventToUser<ICharacterCreateFromServer>(
          nearbyCharacter.channelId!,
          CharacterSocketEvents.CharacterCreate,
          dataFromServer
        );

        const nearbyCharacterPayload = {
          id: nearbyCharacter.id.toString(),
          name: nearbyCharacter.name,
          x: nearbyCharacter.x,
          y: nearbyCharacter.y,
          channelId: nearbyCharacter.channelId!,
          direction: nearbyCharacter.direction as AnimationDirection,
          isMoving: false,
          layer: nearbyCharacter.layer,
          speed: nearbyCharacter.speed,
          movementIntervalMs: nearbyCharacter.movementIntervalMs,
          health: nearbyCharacter.health,
          maxHealth: nearbyCharacter.maxHealth,
          mana: nearbyCharacter.mana,
          maxMana: nearbyCharacter.maxMana,
          textureKey: nearbyCharacter.textureKey,
          alpha: await this.specialEffect.getOpacity(nearbyCharacter),
        };

        // tell the emitter about these other characters too

        this.socketMessaging.sendEventToUser<ICharacterCreateFromServer>(
          emitterChannelId,
          CharacterSocketEvents.CharacterCreate,
          nearbyCharacterPayload
        );
      }
    }
  }

  private async warnAboutWeatherStatus(channelId: string): Promise<void> {
    // how we keep only one record in registry, we have just one do find.
    const lastTimeWeatherChanged = await MapControlTimeModel.findOne();
    if (lastTimeWeatherChanged) {
      const dataOfWeather: IControlTime = {
        time: lastTimeWeatherChanged.time,
        period: lastTimeWeatherChanged.period as PeriodOfDay,
        weather: lastTimeWeatherChanged.weather as AvailableWeather,
      };

      this.socketMessaging.sendEventToUser<IControlTime>(
        channelId!,
        WeatherSocketEvents.TimeWeatherControl,
        dataOfWeather
      );
    }
  }

  private async handleCharacterRegen(character: ICharacter): Promise<void> {
    if (!character) {
      return;
    }

    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
    const healthKey = SpellsBlueprint.HealthRegenSell;
    const manaKey = SpellsBlueprint.ManaRegenSpell;

    const healthCondition = character.health < character.maxHealth;
    const manaCondition = character.mana < character.maxMana;

    try {
      switch (character.class) {
        case CharacterClass.Warrior:
          if (healthCondition) {
            const isActive = await this.inMemoryHashTable.has(namespace, healthKey);
            isActive
              ? this.characterMonitor.unwatch(character)
              : await this.warriorPassiveHabilities.warriorAutoRegenHealthHandler(character);
          }
          break;

        case CharacterClass.Druid:
        case CharacterClass.Sorcerer:
          if (manaCondition) {
            const isActive = await this.inMemoryHashTable.has(namespace, manaKey);
            isActive
              ? this.characterMonitor.unwatch(character)
              : await this.magePassiveHabilities.autoRegenManaHandler(character);
          }
          break;

        default:
          this.characterMonitor.unwatch(character);
          break;
      }
    } catch (error) {
      console.error(`Error regenerating character ${character._id}: ${error}`);
    }
  }
}
