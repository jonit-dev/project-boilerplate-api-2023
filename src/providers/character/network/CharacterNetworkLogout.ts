import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ICharacterParty } from "@entities/ModuleCharacter/CharacterPartyModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import PartyManagement from "@providers/party/PartyManagement";
import { SkillStatsIncrease } from "@providers/skill/SkillStatsIncrease";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketConnection } from "@providers/sockets/SocketConnection";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketSessionControl } from "@providers/sockets/SocketSessionControl";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { SpellLearn } from "@providers/spells/SpellLearn";
import { NamespaceRedisControl } from "@providers/spells/data/types/SpellsBlueprintTypes";
import { CharacterSocketEvents, ICharacterLogout, SpellsBlueprint } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { clearCacheForKey } from "speedgoose";
import { CharacterMonitorQueue } from "../CharacterMonitorQueue";
import { CharacterView } from "../CharacterView";

@provide(CharacterNetworkLogout)
export class CharacterNetworkLogout {
  constructor(
    private socketMessagingHelper: SocketMessaging,
    private socketAuth: SocketAuth,
    private socketConnection: SocketConnection,
    private characterView: CharacterView,
    private inMemoryHashTable: InMemoryHashTable,
    private spellLearn: SpellLearn,
    private characterMonitorQueue: CharacterMonitorQueue,
    private specialEffect: SpecialEffect,
    private socketSessionControl: SocketSessionControl,
    private skillStatsIncrease: SkillStatsIncrease,
    private partyManagement: PartyManagement
  ) {}

  public onCharacterLogout(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterSocketEvents.CharacterLogout,
      async (data: ICharacterLogout, character: ICharacter) => {
        await this.handleLogout(data, character, channel);
      }
    );
  }

  private async handleLogout(data: ICharacterLogout, character: ICharacter, channel: SocketChannel): Promise<void> {
    await this.unwatchCharacter(character);
    await this.notifyNearbyCharacters(data, character);
    await this.updateTextureKeysAndStatus(data, character);
    await this.performCleanup(data, character);
    await this.updateSkillsAndStats(character);
    await this.leavePartyIfExists(character);
    await this.finalizeLogout(character, channel);
  }

  private async unwatchCharacter(character: ICharacter): Promise<void> {
    await this.characterMonitorQueue.unwatchAll(character);
  }

  private async notifyNearbyCharacters(data: ICharacterLogout, character: ICharacter): Promise<void> {
    const nearbyCharacters = await this.characterView.getCharactersInView(character);
    for (const character of nearbyCharacters) {
      this.socketMessagingHelper.sendEventToUser<ICharacterLogout>(
        character.channelId!,
        CharacterSocketEvents.CharacterLogout,
        data
      );
    }
    console.log(`🚪: Character id ${data.id} has disconnected`);
  }

  private async updateTextureKeysAndStatus(data: ICharacterLogout, character: ICharacter): Promise<void> {
    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
    const keys = [SpellsBlueprint.DruidShapeshift, SpellsBlueprint.SorcererVeilofUndeath];

    for (const key of keys) {
      const hasKey = await this.inMemoryHashTable.has(namespace, key);
      let textureKey: any;
      if (hasKey) {
        textureKey = await this.inMemoryHashTable.get(namespace, key);
      }
      await Character.updateOne(
        { _id: data.id },
        {
          isOnline: false,
          textureKey: textureKey || character.textureKey,
        }
      );
    }
  }

  private async performCleanup(data: ICharacterLogout, character: ICharacter): Promise<void> {
    await this.socketSessionControl.deleteSession(character._id);
    await this.specialEffect.clearEffects(character);
    await this.inMemoryHashTable.delete("character-max-weights", character._id);
    await this.inMemoryHashTable.deleteAll(data.id.toString());
    await clearCacheForKey(`characterBuffs_${character._id}`);
    await clearCacheForKey(`${character._id}-skills`);
  }

  private async updateSkillsAndStats(character: ICharacter): Promise<void> {
    const spellLeveling = await this.spellLearn.levelingSpells(character._id, character.skills!);

    if (spellLeveling) {
      console.log(`- Spells have been updated in Character: ${character._id} - channel(${character.channelId!})`);
    }
    await this.skillStatsIncrease.increaseMaxManaMaxHealth(character._id);
  }

  private async leavePartyIfExists(character: ICharacter): Promise<void> {
    const party = (await this.partyManagement.getPartyByCharacterId(character._id)) as ICharacterParty;
    if (party) {
      await this.partyManagement.leaveParty(party._id, character, character);
    }
  }

  private async finalizeLogout(character: ICharacter, channel: SocketChannel): Promise<void> {
    const connectedCharacters = await this.socketConnection.getConnectedCharacters();
    await channel.leave(character.channelId!);
    console.log("- Total characters connected:", connectedCharacters.length);
  }
}
