import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
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
      await this.npcTarget.clearTarget(npc);

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
          throw new Error("No shortest path found!");
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
