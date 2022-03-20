import { Character } from "@entities/ModuleSystem/CharacterModel";
import { INPC } from "@entities/ModuleSystem/NPCModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NPCSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCView } from "../NPCView";
import { NPCTarget } from "./NPCTarget";

@provide(NPCMovementStopped)
export class NPCMovementStopped {
  constructor(private npcTarget: NPCTarget, private socketMessaging: SocketMessaging, private npcView: NPCView) {}

  public async startMovementStopped(npc: INPC): Promise<void> {
    const targetCharacter = await Character.findById(npc.targetCharacter);

    if (targetCharacter) {
      const facingDirection = this.npcTarget.getTargetDirection(npc, targetCharacter.x, targetCharacter.y);

      npc.direction = facingDirection;
      await npc.save();

      const nearbyCharacters = await this.npcView.getCharactersInView(npc);

      for (const nearbyCharacter of nearbyCharacters) {
        this.socketMessaging.sendEventToUser(nearbyCharacter.channelId!, NPCSocketEvents.NPCDataUpdate, {
          id: npc.id,
          direction: npc.direction,
        });
      }
    } else {
      await this.npcTarget.tryToSetTarget(npc);
    }
  }
}
