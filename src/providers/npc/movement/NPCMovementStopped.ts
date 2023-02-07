import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NPCSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCView } from "../NPCView";
import { NPCTarget } from "./NPCTarget";

@provide(NPCMovementStopped)
export class NPCMovementStopped {
  constructor(
    private npcTarget: NPCTarget,
    private socketMessaging: SocketMessaging,
    private npcView: NPCView,
    private characterView: CharacterView
  ) {}

  public async startMovementStopped(npc: INPC): Promise<void> {
    try {
      const targetCharacter = await Character.findById(npc.targetCharacter).lean();

      if (targetCharacter) {
        await this.npcTarget.tryToClearOutOfRangeTargets(npc);

        const facingDirection = this.npcTarget.getTargetDirection(npc, targetCharacter.x, targetCharacter.y);

        await NPC.updateOne({ _id: npc.id }, { direction: facingDirection });

        const nearbyCharacters = await this.npcView.getCharactersInView(npc);

        for (const nearbyCharacter of nearbyCharacters) {
          // client representation of the NPC
          const clientNPC = nearbyCharacter.view.npcs?.[npc.id];
          if (clientNPC?.direction !== facingDirection) {
            // update serverside info (to avoid submitting the same package all the time!)

            await this.characterView.addToCharacterView(
              nearbyCharacter,
              {
                id: npc.id,
                x: npc.x,
                y: npc.y,
                scene: npc.scene,
                direction: facingDirection,
              },
              "npcs"
            );

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
