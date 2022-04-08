import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NPCSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCView } from "../NPCView";
import { NPCTarget } from "./NPCTarget";

@provide(NPCMovementStopped)
export class NPCMovementStopped {
  constructor(private npcTarget: NPCTarget, private socketMessaging: SocketMessaging, private npcView: NPCView) {}

  public async startMovementStopped(npc: INPC): Promise<void> {
    try {
      const targetCharacter = await Character.findById(npc.targetCharacter);

      if (targetCharacter) {
        await this.npcTarget.clearTarget(npc);

        const facingDirection = this.npcTarget.getTargetDirection(npc, targetCharacter.x, targetCharacter.y);

        npc.direction = facingDirection;
        await npc.save();

        const nearbyCharacters = await this.npcView.getCharactersInView(npc);

        for (const nearbyCharacter of nearbyCharacters) {
          // client representation of the NPC
          const clientNPC = nearbyCharacter.otherEntitiesInView?.[npc._id];
          if (clientNPC && clientNPC.direction !== facingDirection) {
            // update serverside info (to avoid submitting the same package all the time!)
            nearbyCharacter.otherEntitiesInView[npc._id].direction = facingDirection;
            await nearbyCharacter.save();

            this.socketMessaging.sendEventToUser(nearbyCharacter.channelId!, NPCSocketEvents.NPCDataUpdate, {
              id: npc.id,
              direction: npc.direction,
            });
          }
        }
      } else {
        await this.npcTarget.tryToSetTarget(npc);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
