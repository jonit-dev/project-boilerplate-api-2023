import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { INPCPositionRequestPayload, NPCSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCWarn } from "../NPCWarn";

@provide(NPCPosition)
export class NPCPosition {
  constructor(private socketAuth: SocketAuth, private npcWarn: NPCWarn) {}

  onNPCPositionRequest(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      NPCSocketEvents.NPCPositionRequest,
      async (data: INPCPositionRequestPayload, character) => {
        const { id, type } = data;

        const npc = (await NPC.findOne({
          _id: id,
        }).lean({ virtuals: true, defaults: true })) as INPC;

        if (!npc) {
          throw new Error(`NPCSocketEvents.NPCPositionRequest, but NPC id ${id} wasn't found.`);
        }

        switch (type) {
          case "create":
            await this.npcWarn.warnCharacterAboutSingleNPCCreation(npc, character);

            break;
          case "update":
            this.npcWarn.warnCharacterAboutSingleNPCUpdate(npc, character);
            break;
        }
      }
    );
  }
}
