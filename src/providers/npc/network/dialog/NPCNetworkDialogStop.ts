import { NPC } from "@entities/ModuleNPC/NPCModel";
import { MathHelper } from "@providers/math/MathHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  GRID_WIDTH,
  INPCStopDialog,
  NPCSocketEvents,
  NPCTargetType,
  NPC_MAX_TALKING_DISTANCE_IN_GRID,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(NPCNetworkDialogStop)
export class NPCNetworkDialogStop {
  constructor(private socketAuth: SocketAuth, private mathHelper: MathHelper) {}

  public onDialogStop(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      NPCSocketEvents.NPCStopDialogNPC,
      async (data: INPCStopDialog, character) => {
        try {
          const { npcId } = data;

          const npc = await NPC.findOne({
            _id: npcId,
          });

          if (npc) {
            if (!npc.targetCharacter) {
              throw new Error("NPC has no target character!");
            }

            if (character.id.toString() !== npc.targetCharacter?.toString()) {
              throw new Error("Character trying to stop NPC dialog is not the same that originated it.");
            }

            // validate if character is under NPC talking distance

            const distanceCharNPC = this.mathHelper.getDistanceBetweenPoints(npc.x, npc.y, character.x, character.y);

            const isUnderRange = distanceCharNPC <= NPC_MAX_TALKING_DISTANCE_IN_GRID * GRID_WIDTH * 2; // a little more distance to be sure

            if (isUnderRange) {
              npc.currentMovementType = npc.originalMovementType;
              npc.targetCharacter = undefined;
              npc.targetType = NPCTargetType.Default;
              await npc.save();
            } else {
              throw new Error("Failed to stop NPC dialog, character is out of range.");
            }
          } else {
            throw new Error(`NPCSocketEvents.NPCStopDialogNPC, but NPC id ${npcId} wasn't found.`);
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
}
