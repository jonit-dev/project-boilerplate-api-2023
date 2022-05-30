import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import { DataStructureHelper } from "@providers/dataStructures/DataStructuresHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import {
  GRID_HEIGHT,
  GRID_WIDTH,
  INPCPositionUpdatePayload,
  NPCAlignment,
  NPCSocketEvents,
  SOCKET_TRANSMISSION_ZONE_WIDTH,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Model } from "mongoose";

interface IElementWithPosition {
  x: number;
  y: number;
}
@provide(NPCView)
export class NPCView {
  constructor(
    private socketMessaging: SocketMessaging,
    private playerView: CharacterView,
    private socketTransmissionZone: SocketTransmissionZone,
    private characterView: CharacterView,
    private objectHelper: DataStructureHelper
  ) {}

  public async getElementsInNPCView<T extends IElementWithPosition>(
    Element: Model<T>,
    npc: INPC,
    filter?: Record<string, unknown>
  ): Promise<T[]> {
    const socketTransmissionZone = this.socketTransmissionZone.calculateSocketTransmissionZone(
      npc.x,
      npc.y,
      GRID_WIDTH,
      GRID_HEIGHT,
      SOCKET_TRANSMISSION_ZONE_WIDTH,
      SOCKET_TRANSMISSION_ZONE_WIDTH
    );

    // @ts-ignore
    const otherElementsInView = await Element.find({
      $and: [
        {
          x: {
            $gte: socketTransmissionZone.x,
            $lte: socketTransmissionZone.width,
          },
        },
        {
          y: {
            $gte: socketTransmissionZone.y,
            $lte: socketTransmissionZone.height,
          },
        },
        {
          scene: npc.scene,
          ...filter,
        },
      ],
    });
    return otherElementsInView as unknown as T[];
  }

  public async getCharactersInView(npc: INPC): Promise<ICharacter[]> {
    return await this.getElementsInNPCView(Character, npc, {
      isOnline: true,
    });
  }

  public async warnCharacterAboutNPCsInView(character: ICharacter): Promise<void> {
    const npcsInView = await this.getNPCsInView(character);

    for (const npc of npcsInView) {
      const npcOnCharView = character.view.npcs[npc.id];

      // if we already have a representation there, just skip!
      if (npcOnCharView) {
        const doesServerNPCMatchesClientNPC = this.objectHelper.doesObjectAttrMatches(npcOnCharView, npc, [
          "id",
          "scene",
        ]);

        if (doesServerNPCMatchesClientNPC) {
          continue;
        }
      }

      await this.characterView.addToCharacterView(
        character,
        {
          id: npc.id,
          x: npc.x,
          y: npc.y,
          scene: npc.scene,
        },
        "npcs"
      );

      this.socketMessaging.sendEventToUser<INPCPositionUpdatePayload>(
        character.channelId!,
        NPCSocketEvents.NPCPositionUpdate,
        {
          id: npc.id,
          name: npc.name,
          x: npc.x,
          y: npc.y,
          direction: npc.direction,
          key: npc.key,
          layer: npc.layer,
          textureKey: npc.textureKey,
          scene: npc.scene,
          speed: npc.speed,
          alignment: npc.alignment as NPCAlignment,
          health: npc.health,
          maxHealth: npc.maxHealth,
          mana: npc.mana,
          maxMana: npc.maxMana,
        }
      );
    }
  }

  public async getNPCsInView(character: ICharacter): Promise<INPC[]> {
    const npcsInView = await this.playerView.getElementsInCharView(NPC, character, {
      health: { $gt: 0 }, // only npcs that are alive!
    });

    return npcsInView;
  }
}
