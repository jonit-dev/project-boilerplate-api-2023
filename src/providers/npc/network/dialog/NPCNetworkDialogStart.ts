import { NPC } from "@entities/ModuleNPC/NPCModel";
import { MathHelper } from "@providers/math/MathHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { InterpolationParser } from "@providers/text/InterpolationParser";
import {
  GRID_WIDTH,
  INPCGetInfoEmitterClient,
  INPCStartDialog,
  NPCMovementType,
  NPCSocketEvents,
  NPCTargetType,
  NPC_MAX_TALKING_DISTANCE_IN_GRID,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(NPCNetworkDialogStart)
export class NPCNetworkDialogStart {
  constructor(
    private socketAuth: SocketAuth,
    private mathHelper: MathHelper,
    private socketMessaging: SocketMessaging,
    private interpolationParser: InterpolationParser
  ) {}

  public onDialogStart(channel: SocketChannel): void {
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

        const isUnderRange = distanceCharNPC <= NPC_MAX_TALKING_DISTANCE_IN_GRID * GRID_WIDTH;
        if (isUnderRange) {
          npc.currentMovementType = NPCMovementType.Stopped;
          npc.targetType = NPCTargetType.Talking;
          npc.targetCharacter = character._id;
          await npc.save();

          const dialogText = this.interpolationParser.parse(npc.dialogText, character);

          if (dialogText) {
            this.socketMessaging.sendEventToUser<INPCStartDialog>(
              character.channelId!,
              NPCSocketEvents.NPCStartDialogNPC,
              {
                npcId: npc._id,
                dialogText,
              }
            );
          } else {
            console.log(`NPCTalkToNPC > NPC dialogText is empty: ${npc._id}`);
          }

          setTimeout(() => {
            // clear target and rollback movement type
            npc.currentMovementType = npc.originalMovementType;
            npc.targetCharacter = undefined;
            npc.targetType = NPCTargetType.Default;
            npc.save();
          }, 60 * 1000);
        } else {
          console.log(`NPC ${npc.name} out of range to start dialog..`);
        }
      }
    );
  }
}
