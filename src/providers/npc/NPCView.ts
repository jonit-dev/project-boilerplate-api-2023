import { ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { INPC, NPC } from "@entities/ModuleSystem/NPCModel";
import { PlayerView } from "@providers/player/PlayerView";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ISocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { IEntitiesInView, INPCPositionUpdatePayload, NPCSocketEvents } from "@rpg-engine/shared";
import { EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import { Model } from "mongoose";

interface IElementWithPosition {
  x: number;
  y: number;
}
@provide(NPCView)
export class NPCView {
  constructor(private socketMessaging: SocketMessaging, private playerView: PlayerView) {}

  public async getElementsInNPCView<T extends IElementWithPosition>(
    Element: Model<T>,
    npc: INPC,
    filter?: Record<string, unknown>
  ): Promise<T[]> {
    if (!npc.socketTransmissionZone) {
      console.log(`Error: npc ${npc.key} has no defined socket transmission zone!`);
      return [];
    }

    const socketTransmissionZone = npc.socketTransmissionZone as unknown as ISocketTransmissionZone;

    // @ts-ignore
    const otherCharactersInView = await Element.find({
      $and: [
        {
          x: {
            $gte: socketTransmissionZone.x,
            $lte: socketTransmissionZone.x + socketTransmissionZone.width,
          },
        },
        {
          y: {
            $gte: socketTransmissionZone.y,
            $lte: socketTransmissionZone.y + socketTransmissionZone.height,
          },
        },
        {
          scene: npc.scene,
          ...filter,
        },
      ],
    });
    return otherCharactersInView as unknown as T[];
  }

  public async warnUserAboutNPCsInView(character: ICharacter, otherEntitiesInView?: IEntitiesInView): Promise<void> {
    const npcsInView = await this.getNPCsInView(character);

    for (const npc of npcsInView) {
      if (otherEntitiesInView && otherEntitiesInView[npc.id] && otherEntitiesInView[npc.id].type === EntityType.NPC) {
        continue; // we dont need to warn the user about the npc, since it already has it on his view
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
        }
      );
    }
  }

  public async getNPCsInView(character: ICharacter): Promise<INPC[]> {
    const npcsInView = await this.playerView.getElementsInCharView(NPC, character);

    return npcsInView;
  }
}
