import { NPC } from "@entities/ModuleNPC/NPCModel";
import { MathHelper } from "@providers/math/MathHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { INPCStopDialog, NPCSocketEvents, NPCTargetType, NPC_TALKING_DISTANCE } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(NPCNetworkDialogStop)
export class NPCNetworkDialogStop {
  constructor(private socketAuth: SocketAuth, private mathHelper: MathHelper) {}

  public onDialogStop(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      NPCSocketEvents.NPCStopDialogNPC,
      async (data: INPCStopDialog, character) => {
        const { npcId } = data;

        const npc = await NPC.findOne({
          _id: npcId,
        });

        if (npc) {
          if (character.id.toString() !== npc.targetCharacter?.toString()) {
            console.log("Character trying to stop NPC dialog is not the same that originated it.");
            return;
          }

          // validate if character is under NPC talking distance

          const distanceCharNPC = this.mathHelper.getDistanceBetweenPoints(npc.x, npc.y, character.x, character.y);

          const isUnderRange = distanceCharNPC <= NPC_TALKING_DISTANCE * 2; // a little more distance to be sure

          if (isUnderRange) {
            npc.currentMovementType = npc.originalMovementType;
            npc.targetCharacter = undefined;
            npc.targetType = NPCTargetType.Default;
            await npc.save();
          }
        }
      }
    );
  }
}
