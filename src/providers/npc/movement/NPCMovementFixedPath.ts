import { INPC } from "@entities/ModuleSystem/NPCModel";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { ScenesMetaData, ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCMovement } from "./NPCMovement";

@provide(NPCMovementFixedPath)
export class NPCMovementFixedPath {
  constructor(private movementHelper: MovementHelper, private NPCMovement: NPCMovement) {}

  public async startFixedPathMovement(npc: INPC, endGridX: number, endGridY: number): Promise<void> {
    if (endGridX && endGridY) {
      const npcPath = this.movementHelper.findShortestPath(
        ScenesMetaData[npc.scene].map,
        ToGridX(npc.x),
        ToGridY(npc.y),
        endGridX,
        endGridY
      );

      if (!npcPath || npcPath.length <= 1) {
        console.log("Failed to calculated fixed path. NPC is stopped");
        return;
      }

      const [newGridX, newGridY] = npcPath[1];

      const nextMovementDirection = this.movementHelper.getGridMovementDirection(
        ToGridX(npc.x),
        ToGridY(npc.y),
        newGridX,
        newGridY
      );

      if (nextMovementDirection) {
        const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(npc.x, npc.y, nextMovementDirection);

        await this.NPCMovement.moveNPC(npc, npc.x, npc.y, newX, newY, nextMovementDirection);
      } else {
        console.log("Failed to calculate fixed path. nextMovementDirection is undefined");
      }
    } else {
      console.log(
        "Failed to calculate fixed path. You must have a endGridX and endGridY position set in your NPC model"
      );
    }
  }
}
