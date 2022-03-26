import { Character } from "@entities/ModuleSystem/CharacterModel";
import { INPC } from "@entities/ModuleSystem/NPCModel";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { FromGridX, FromGridY, ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCMovement } from "./NPCMovement";
import { NPCTarget } from "./NPCTarget";

@provide(NPCMovementMoveTowards)
export class NPCMovementMoveTowards {
  constructor(private movementHelper: MovementHelper, private npcMovement: NPCMovement, private npcTarget: NPCTarget) {}

  public async startMoveTowardsMovement(npc: INPC): Promise<void> {
    // first step is setting a target
    // for this, get all characters nearby and set the target to the closest one

    const targetCharacter = await Character.findById(npc.targetCharacter);

    if (targetCharacter) {
      await this.npcTarget.checkTargetOutOfRangeOrLoggedOut(npc);

      const reachedTarget = this.movementHelper.isUnderRange(npc.x, npc.y, targetCharacter.x, targetCharacter.y, 1);

      if (reachedTarget) {
        console.log("Reached target. Nothing to do here!");
        return;
      }

      try {
        const shortestPath = this.npcMovement.getShortestPathNextPosition(
          npc,
          ToGridX(npc.x),
          ToGridY(npc.y),
          ToGridX(targetCharacter.x),
          ToGridY(targetCharacter.y)
        );

        if (!shortestPath) {
          console.log("No shortest path found!");
          return;
        }

        const { newGridX, newGridY, nextMovementDirection } = shortestPath;

        if (newGridX && newGridY && nextMovementDirection) {
          await this.npcMovement.moveNPC(
            npc,
            npc.x,
            npc.y,
            FromGridX(newGridX),
            FromGridY(newGridY),
            nextMovementDirection
          );
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      await this.npcTarget.tryToSetTarget(npc);
    }
  }
}
