import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
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
import { EntityType, IEntitiesInView } from "@rpg-engine/shared/dist/types/entity.types";
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
    private socketTransmissionZone: SocketTransmissionZone
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

  public async warnUserAboutNPCsInView(character: ICharacter, otherEntitiesInView?: IEntitiesInView): Promise<void> {
    const npcsInView = await this.getNPCsInView(character);

    for (const npc of npcsInView) {
      if (otherEntitiesInView && otherEntitiesInView[npc.id]) {
        const clientNPC = otherEntitiesInView[npc.id];

        if (clientNPC.type === EntityType.NPC) {
          continue; // we dont need to warn the user about the npc, since it already has it on his view
        }
      }

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
    const npcsInView = await this.playerView.getElementsInCharView(NPC, character);

    return npcsInView;
  }
}
