import { INPC } from "@entities/ModuleSystem/NPCModel";
import { ToGridX, ToGridY } from "@providers/map/GridHelper";
import { TilemapParser } from "@providers/map/TilemapParser";
import { GRID_HEIGHT, GRID_WIDTH, ScenesMetaData } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

type NPCMovementDirection = "up" | "down" | "left" | "right";

interface IPosition {
  x: number;
  y: number;
}

@provide(NPCManager)
export class NPCManager {
  constructor(private tilemapParser: TilemapParser) {}

  public init(NPCs: INPC[]): void {
    const availableDirections = ["down", "up", "right", "left"] as unknown as NPCMovementDirection;

    setInterval(async () => {
      for (const npc of NPCs) {
        const chosenMovementDirection = _.shuffle(availableDirections)[0] as NPCMovementDirection;

        const { x: newX, y: newY } = this.calculateNewPositionXY(npc.x, npc.y, chosenMovementDirection);

        const newGridX = ToGridX(newX);
        const newGridY = ToGridY(newY);

        const isNewXYSolid = this.tilemapParser.isSolid(ScenesMetaData[npc.scene].map, newGridX, newGridY, npc.layer);

        if (!isNewXYSolid) {
          console.log(`${npc.name} moved to ${newGridX}, ${newGridY}`);
          npc.x = newX;
          npc.y = newY;
          await npc.save();
        } else {
          console.log(`${npc.name} tried to move to ${newGridX}, ${newGridY} but it's solid`);
        }
      }
    }, 3000);
  }

  private calculateNewPositionXY(x: number, y: number, moveToDirection: NPCMovementDirection): IPosition {
    switch (moveToDirection) {
      case "down":
        return {
          x,
          y: y + GRID_HEIGHT,
        };
      case "up":
        return {
          x,
          y: y - GRID_HEIGHT,
        };
      case "left":
        return {
          x: x - GRID_WIDTH,
          y,
        };
      case "right":
        return {
          x: x + GRID_WIDTH,
          y,
        };
    }
  }
}
