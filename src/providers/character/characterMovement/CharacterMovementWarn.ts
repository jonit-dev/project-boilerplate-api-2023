import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemView } from "@providers/item/ItemView";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { NPCWarn } from "@providers/npc/NPCWarn";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  AnimationDirection,
  CharacterSocketEvents,
  IAllCharacterPositionUpdateFromServer,
  ICharacterPositionUpdateFromClient,
  ICharacterPositionUpdateFromServer,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterView } from "../CharacterView";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";

@provide(CharacterMovementWarn)
export class CharacterMovementWarn {
  constructor(
    private npcWarn: NPCWarn,
    private characterView: CharacterView,
    private socketMessaging: SocketMessaging,
    private movementHelper: MovementHelper,
    private itemView: ItemView,
    private specialEffect: SpecialEffect
  ) {}

  public async warn(character: ICharacter, data: ICharacterPositionUpdateFromClient): Promise<void> {
    // bi-directional warn

    await this.warnCharactersAroundAboutEmitterPositionUpdate(character, data);

    await this.warnEmitterAboutCharactersAround(character);

    await this.npcWarn.warnCharacterAboutNPCsInView(character);

    // ! Disabled because it some "players" spam items on the ground, it will cause the emissor to get stuck.
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.itemView.warnCharacterAboutItemsInView(character, { always: false });
  }

  public async warnAboutSingleCharacter(character: ICharacter, targetCharacter: ICharacter): Promise<void> {
    await this.characterView.addToCharacterView(
      character,
      {
        id: targetCharacter.id,
        x: targetCharacter.x,
        y: targetCharacter.y,
        direction: targetCharacter.direction,
        scene: targetCharacter.scene,
      },
      "characters"
    );

    this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.CharacterPositionUpdate, {
      id: targetCharacter.id,
      name: targetCharacter.name,
      x: targetCharacter.x,
      y: targetCharacter.y,
      newX: targetCharacter.x,
      newY: targetCharacter.y,
      channelId: targetCharacter.channelId!,
      direction: targetCharacter.direction as AnimationDirection,
      layer: targetCharacter.layer,
      isMoving: false,
      speed: targetCharacter.speed,
      movementIntervalMs: targetCharacter.movementIntervalMs,
      health: targetCharacter.health,
      maxHealth: targetCharacter.maxHealth,
      mana: targetCharacter.mana,
      maxMana: targetCharacter.maxMana,
      textureKey: targetCharacter.textureKey,
      alpha: await this.specialEffect.getOpacity(targetCharacter),
    });
  }

  private async warnCharactersAroundAboutEmitterPositionUpdate(
    character: ICharacter,
    clientPosUpdateData: ICharacterPositionUpdateFromClient
  ): Promise<void> {
    const nearbyCharacters = await this.characterView.getCharactersInView(character);

    for (const nearbyCharacter of nearbyCharacters) {
      const dataFromServer = await this.generateDataPayloadFromServer(clientPosUpdateData, character);

      await this.characterView.addToCharacterView(
        nearbyCharacter,
        {
          id: character.id,
          x: character.x,
          y: character.y,
          direction: clientPosUpdateData.direction,
          scene: character.scene,
        },
        "characters"
      );

      this.socketMessaging.sendEventToUser<ICharacterPositionUpdateFromServer>(
        nearbyCharacter.channelId!,
        CharacterSocketEvents.CharacterPositionUpdate,
        dataFromServer
      );
    }
  }

  private async warnEmitterAboutCharactersAround(character: ICharacter): Promise<void> {
    const nearbyCharacters = await this.characterView.getCharactersInView(character);

    const nearbyCharacterDataPayloads: ICharacterPositionUpdateFromServer[] = [];

    for (const nearbyCharacter of nearbyCharacters) {
      if (!(await this.shouldWarnCharacter(character, nearbyCharacter))) {
        continue;
      }

      await this.characterView.addToCharacterView(
        character,
        {
          id: nearbyCharacter.id,
          x: nearbyCharacter.x,
          y: nearbyCharacter.y,
          direction: nearbyCharacter.direction,
          scene: nearbyCharacter.scene,
        },
        "characters"
      );

      nearbyCharacterDataPayloads.push({
        id: nearbyCharacter.id,
        name: nearbyCharacter.name,
        x: nearbyCharacter.x,
        y: nearbyCharacter.y,
        newX: nearbyCharacter.x,
        newY: nearbyCharacter.y,
        channelId: nearbyCharacter.channelId!,
        direction: nearbyCharacter.direction as AnimationDirection,
        layer: nearbyCharacter.layer,
        isMoving: false,
        speed: nearbyCharacter.speed,
        movementIntervalMs: nearbyCharacter.movementIntervalMs,
        health: nearbyCharacter.health,
        maxHealth: nearbyCharacter.maxHealth,
        mana: nearbyCharacter.mana,
        maxMana: nearbyCharacter.maxMana,
        textureKey: nearbyCharacter.textureKey,
        alpha: await this.specialEffect.getOpacity(nearbyCharacter),
      });
    }

    if (nearbyCharacterDataPayloads.length === 0) return;

    this.socketMessaging.sendEventToUser<IAllCharacterPositionUpdateFromServer>(
      character.channelId!,
      CharacterSocketEvents.CharacterPositionUpdateAll,
      {
        nearbyCharacters: nearbyCharacterDataPayloads,
      }
    );
  }

  private async shouldWarnCharacter(emitter: ICharacter, nearbyCharacter: ICharacter): Promise<boolean> {
    const charOnCharView = await this.characterView.getElementOnView(emitter, nearbyCharacter._id, "characters");

    if (!charOnCharView) {
      return true;
    }

    return false;
  }

  private async generateDataPayloadFromServer(
    dataFromClient: ICharacterPositionUpdateFromClient,
    character: ICharacter
  ): Promise<ICharacterPositionUpdateFromServer> {
    const isMoving = this.movementHelper.isMoving(character.x, character.y, dataFromClient.newX, dataFromClient.newY);

    return {
      ...dataFromClient,
      id: character.id,
      x: character.x,
      y: character.y,
      name: character.name,
      direction: dataFromClient.direction,
      isMoving,
      layer: character.layer,
      channelId: character.channelId!,
      speed: character.speed,
      movementIntervalMs: character.movementIntervalMs,
      health: character.health,
      maxHealth: character.maxHealth,
      mana: character.mana,
      maxMana: character.maxMana,
      textureKey: character.textureKey,
      alpha: await this.specialEffect.getOpacity(character),
    };
  }
}
