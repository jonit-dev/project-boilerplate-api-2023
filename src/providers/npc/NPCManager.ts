import { INPC } from "@entities/ModuleSystem/NPCModel";
import { TilemapParser } from "@providers/map/TilemapParser";
import { GRID_HEIGHT, GRID_WIDTH } from "@rpg-engine/shared";
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
    const availableDirections = ["up", "down", "left", "right"] as unknown as NPCMovementDirection;

    this.tilemapParser.init("another_map", "forest");

    setInterval(async () => {
      for (const npc of NPCs) {
        const chosenMovementDirection = _.shuffle(availableDirections)[0] as NPCMovementDirection;

        const { x: newX, y: newY } = this.calculateNewPositionXY(npc.x, npc.y, chosenMovementDirection);
        console.log(`Moving NPC ${npc.name} ${chosenMovementDirection} x=${newX} y=${newY}`);

        //! TODO: Verify if this position has a solid tile.

        npc.x = newX;
        npc.y = newY;

        await npc.save();
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
