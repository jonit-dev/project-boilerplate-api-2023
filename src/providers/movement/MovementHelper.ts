import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { MapSolids, SolidCheckStrategy } from "@providers/map/MapSolids";
import { MapTransition } from "@providers/map/MapTransition";
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
export interface IPosition {
  x: number;
  y: number;
}

@provide(MovementHelper)
export class MovementHelper {
  constructor(private mathHelper: MathHelper, private mapSolids: MapSolids, private mapTransition: MapTransition) {}

  public isSnappedToGrid(x: number, y: number): boolean {
    return x % GRID_WIDTH === 0 && y % GRID_WIDTH === 0;
  }

  public isSolid = async (
    map: string,
    gridX: number,
    gridY: number,
    layer: MapLayers,
    strategy: SolidCheckStrategy = "CHECK_ALL_LAYERS_BELOW",
    caller: INPC | ICharacter | undefined = undefined
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

    const hasSolid = this.mapSolids.isTileSolid(map, gridX, gridY, layer, strategy);

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

    if (caller instanceof NPC) {
      const hasTransition = this.mapTransition.getTransitionAtXY(map, FromGridX(gridX), FromGridY(gridY));

      if (hasTransition) {
        return true;
      }
    }

    return false;
  };

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
