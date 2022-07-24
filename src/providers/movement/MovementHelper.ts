import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { NPC } from "@entities/ModuleNPC/NPCModel";
import { MapLoader } from "@providers/map/MapLoader";
import { MapSolids } from "@providers/map/MapSolids";
import { MathHelper } from "@providers/math/MathHelper";
import {
  AnimationDirection,
  calculateNewPositionXY,
  FromGridX,
  FromGridY,
  GRID_WIDTH,
  MapLayers,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import PF from "pathfinding";
interface IPosition {
  x: number;
  y: number;
}

@provide(MovementHelper)
export class MovementHelper {
  constructor(private mathHelper: MathHelper, private mapSolids: MapSolids) {}

  public isSolid = async (
    map: string,
    gridX: number,
    gridY: number,
    layer: MapLayers,
    checkAllLayersBelow: boolean = true
  ): Promise<boolean> => {
    // check for characters and NPCs

    const hasNPC = await NPC.exists({
      x: FromGridX(gridX),
      y: FromGridY(gridY),
      layer,
      health: { $gt: 0 },
      scene: map,
    });

    if (hasNPC) {
      return true;
    }

    const hasCharacter = await Character.exists({
      x: FromGridX(gridX),
      y: FromGridY(gridY),
      isOnline: true,
      layer,
      scene: map,
    });

    if (hasCharacter) {
      return true;
    }

    const hasSolid = await this.mapSolids.isTileSolid(map, gridX, gridY, layer, checkAllLayersBelow);

    if (hasSolid) {
      return true;
    }

    const hasItem = await Item.exists({
      x: FromGridX(gridX),
      y: FromGridY(gridY),
      isSolid: true,
      scene: map,
    });

    if (hasItem) {
      return true;
    }

    return false;
  };

  public findShortestPath(
    map: string,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): number[][] | undefined {
    try {
      const gridMap = MapLoader.grids.get(map);

      if (!gridMap) {
        throw new Error(`Failed to find grid for ${map}`);
      } else {
        const tempGrid = gridMap.clone(); // should be cloned, otherwise it will be modified by the finder!

        const finder = new PF.AStarFinder();

        //! According to the docs, both start and end point MUST be walkable, otherwise it will return [] and crash the pathfinding!
        //! To avoid any issues in the main grid we'll just set this walkable in the tempGrid!

        tempGrid.setWalkableAt(startGridX, startGridY, true);
        tempGrid.setWalkableAt(endGridX, endGridY, true);

        const path = finder.findPath(startGridX, startGridY, endGridX, endGridY, tempGrid!);

        return path;
      }
    } catch (error) {
      console.error(error);
    }
  }

  public isMoving(startX: number, startY: number, endX: number, endY: number): boolean {
    const xDiff = endX - startX;
    const yDiff = endY - startY;

    if (xDiff === 0 && yDiff === 0) {
      return false;
    }

    return true;
  }

  public getGridMovementDirection(
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): AnimationDirection | undefined {
    const Xdiff = endGridX - startGridX;
    const Ydiff = endGridY - startGridY;

    if (Xdiff < 0 && Ydiff === 0) {
      return "left";
    }

    if (Xdiff > 0 && Ydiff === 0) {
      return "right";
    }

    if (Xdiff === 0 && Ydiff < 0) {
      return "up";
    }

    if (Xdiff === 0 && Ydiff > 0) {
      return "down";
    }
  }

  public isUnderRange(
    initialX: number,
    initialY: number,
    newX: number,
    newY: number,
    maxRangeInGridCells: number
  ): boolean {
    const distance = this.mathHelper.getDistanceBetweenPoints(initialX, initialY, newX, newY);

    // convert distance to abs value
    const distanceInGridCells = Math.round(Math.abs(distance / GRID_WIDTH));

    return distanceInGridCells <= maxRangeInGridCells;
  }

  public calculateNewPositionXY(x: number, y: number, moveToDirection: AnimationDirection): IPosition {
    return calculateNewPositionXY(x, y, moveToDirection);
  }

  public getOppositeDirection(direction: AnimationDirection): AnimationDirection {
    switch (direction) {
      case "down":
        return "up";
      case "up":
        return "down";
      case "left":
        return "right";
      case "right":
        return "left";
    }
  }
}
