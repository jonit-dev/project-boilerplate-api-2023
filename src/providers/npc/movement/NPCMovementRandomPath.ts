/* eslint-disable no-unused-vars */
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { NPCDirection, NPCMovement } from "./NPCMovement";

@provide(NPCMovementRandomPath)
export class NPCMovementRandomPath {
  constructor(private movementHelper: MovementHelper, private NPCMovement: NPCMovement) {}

  public async startRandomMovement(npc: INPC): Promise<boolean | undefined> {
    try {
      let chosenMovementDirection = this.pickRandomDirectionToMove();

      const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(npc.x, npc.y, chosenMovementDirection);

      // npcMetaData stores the initial X and Y! That's why we don't use the npc.x and npc.y as initial args
      const isMovementUnderRange = npc.maxRangeInGridCells
        ? this.movementHelper.isUnderRange(npc.initialX, npc.initialY, newX, newY, npc.maxRangeInGridCells)
        : true;

      if (!isMovementUnderRange) {
        chosenMovementDirection = this.movementHelper.getOppositeDirection(chosenMovementDirection);
        const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(npc.x, npc.y, chosenMovementDirection);
        await this.NPCMovement.moveNPC(npc, npc.x, npc.y, newX, newY, chosenMovementDirection);
        return false; // movement out of range
      } else {
        await this.NPCMovement.moveNPC(npc, npc.x, npc.y, newX, newY, chosenMovementDirection);
        return true; // random movement complete
      }
    } catch (error) {
      console.error(error);
    }
  }

  private pickRandomDirectionToMove(): NPCDirection {
    const availableDirections = ["down", "up", "right", "left"] as unknown as NPCDirection;
    return _.shuffle(availableDirections)[0] as NPCDirection;
  }
}
