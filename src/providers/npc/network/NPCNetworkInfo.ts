import { NPC } from "@entities/ModuleNPC/NPCModel";
import { MathHelper } from "@providers/math/MathHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { GRID_WIDTH, INPCGetInfoEmitterClient, NPCMovementType, NPCSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(NPCNetworkInfo)
export class NPCNetworkInfo {
  constructor(
    private socketAuth: SocketAuth,
    private mathHelper: MathHelper,
    private socketMessaging: SocketMessaging
  ) {}

  public onNPCInfo(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      NPCSocketEvents.NPCTalkToNPC,
      async (data: INPCGetInfoEmitterClient, character) => {
        console.log(`📨 Received ${NPCSocketEvents.NPCTalkToNPC}: ${JSON.stringify(data)}`);

        const npc = await NPC.findOne({
          _id: data.npcId,
        });

        if (!npc) {
          console.log(`NPCTalkToNPC > NPC not found: ${data.npcId}`);
          return;
        }

        const distanceCharNPC = this.mathHelper.getDistanceBetweenPoints(npc.x, npc.y, character.x, character.y);

        const isUnderRange = distanceCharNPC < GRID_WIDTH * 5;
        if (isUnderRange) {
          const originalMovementType = npc.movementType;
          npc.movementType = NPCMovementType.Stopped;
          npc.targetCharacter = character._id;
          await npc.save();

          this.socketMessaging.sendEventToUser(character.channelId!, NPCSocketEvents.NPCStartDialogNPC, {
            id: npc._id,
            dialogText: npc.dialogText,
          });

          setTimeout(() => {
            // clear target and rollback movement type
            npc.movementType = originalMovementType;
            npc.targetCharacter = undefined;
            npc.save();
          }, 60 * 1000);
        }
      }
    );
  }
}
