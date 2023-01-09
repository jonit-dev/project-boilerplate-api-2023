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

@provide(CharacterMovementWarn)
export class CharacterMovementWarn {
  constructor(
    private npcWarn: NPCWarn,
    private characterView: CharacterView,
    private itemView: ItemView,
    private socketMessaging: SocketMessaging,
    private movementHelper: MovementHelper
  ) {}

  public async warn(character: ICharacter, data: ICharacterPositionUpdateFromClient): Promise<void> {
    // bi-directional warn

    await this.warnCharactersAroundAboutEmitterPositionUpdate(character, data);

    await this.warnEmitterAboutCharactersAround(character);

    await this.npcWarn.warnCharacterAboutNPCsInView(character);

    await this.itemView.warnCharacterAboutItemsInView(character);
  }

  private async warnCharactersAroundAboutEmitterPositionUpdate(
    character: ICharacter,
    clientPosUpdateData: ICharacterPositionUpdateFromClient
  ): Promise<void> {
    const nearbyCharacters = await this.characterView.getCharactersInView(character);

    for (const nearbyCharacter of nearbyCharacters) {
      const dataFromServer = this.generateDataPayloadFromServer(clientPosUpdateData, character);

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
      if (!this.shouldWarnCharacter(character, nearbyCharacter)) {
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

  private shouldWarnCharacter(emitter: ICharacter, nearbyCharacter: ICharacter): boolean {
    const charOnCharView = emitter.view.characters[nearbyCharacter.id];

    if (!charOnCharView) {
      return true;
    }

    return false;
  }

  private generateDataPayloadFromServer(
    dataFromClient: ICharacterPositionUpdateFromClient,
    character: ICharacter
  ): ICharacterPositionUpdateFromServer {
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
    };
  }
}
