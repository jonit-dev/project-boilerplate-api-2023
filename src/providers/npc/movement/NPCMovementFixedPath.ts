import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FromGridX, FromGridY, ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
// eslint-disable-next-line no-unused-vars
import { MapHelper } from "@providers/map/MapHelper";
import { NPCFreezer } from "../NPCFreezer";
import { NPCMovement } from "./NPCMovement";

@provide(NPCMovementFixedPath)
export class NPCMovementFixedPath {
  constructor(private NPCMovement: NPCMovement, private npcFreezer: NPCFreezer, private mapHelper: MapHelper) {}

  public async startFixedPathMovement(npc: INPC, endGridX: number, endGridY: number): Promise<void> {
    try {
      const shortestPath = await this.NPCMovement.getShortestPathNextPosition(
        npc,
        ToGridX(npc.x),
        ToGridY(npc.y),
        endGridX,
        endGridY
      )!;

      if (!shortestPath) {
        // throw new Error("No shortest path found!");

        await this.npcFreezer.freezeNPC(npc);

        return;
      }

      const { newGridX, newGridY, nextMovementDirection } = shortestPath;
      const validCoordinates = this.mapHelper.areAllCoordinatesValid([newGridX, newGridY]);

      if (validCoordinates && nextMovementDirection) {
        await this.NPCMovement.moveNPC(
          npc,
          npc.x,
          npc.y,
          FromGridX(newGridX),
          FromGridY(newGridY),
          nextMovementDirection
        );
      } else {
        throw new Error("Error: Missing newGridX, newGridY or nextMovementDirection while trying to move NPC");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
