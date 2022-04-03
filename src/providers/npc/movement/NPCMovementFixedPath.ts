import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FromGridX, FromGridY, ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCMovement } from "./NPCMovement";

@provide(NPCMovementFixedPath)
export class NPCMovementFixedPath {
  constructor(private NPCMovement: NPCMovement) {}

  public async startFixedPathMovement(npc: INPC, endGridX: number, endGridY: number): Promise<void> {
    const shortestPath = this.NPCMovement.getShortestPathNextPosition(
      npc,
      ToGridX(npc.x),
      ToGridY(npc.y),
      endGridX,
      endGridY
    )!;

    if (!shortestPath) {
      console.log("No shortest path found!");
      return;
    }

    const { newGridX, newGridY, nextMovementDirection } = shortestPath;

    if (newGridX && newGridY && nextMovementDirection) {
      await this.NPCMovement.moveNPC(
        npc,
        npc.x,
        npc.y,
        FromGridX(newGridX),
        FromGridY(newGridY),
        nextMovementDirection
      );
    } else {
      console.log("Error: Missing newGridX, newGridY or nextMovementDirection while trying to move NPC");
    }
  }
}
