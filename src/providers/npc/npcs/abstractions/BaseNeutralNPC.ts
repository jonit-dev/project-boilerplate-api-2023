import { appEnv } from "@providers/config/env";
import {
  AnimationDirection,
  CharacterClass,
  FixedPathOrientation,
  FromGridX,
  FromGridY,
  MapLayers,
  NPCAlignment,
  NPCMovementType,
} from "@rpg-engine/shared";
import _ from "lodash";

export const generateRandomMovement = (initialGridX: number, initialGridY: number): any => {
  return {
    x: FromGridX(initialGridX),
    y: FromGridY(initialGridY),
    direction: "down" as AnimationDirection,
    alignment: NPCAlignment.Neutral,
    class: CharacterClass.None,
    layer: MapLayers.Player,
    movementType: NPCMovementType.Random,
    maxRangeInGridCells: 5,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};

export const generateMoveTowardsMovement = (initialGridX: number, initialGridY: number): any => {
  return {
    x: FromGridX(initialGridX),
    y: FromGridY(initialGridY),
    direction: "down" as AnimationDirection,
    alignment: NPCAlignment.Neutral,
    class: CharacterClass.None,
    layer: MapLayers.Player,
    movementType: NPCMovementType.MoveTowards,
    maxRangeInGridCells: 20,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};

export const generateFixedPathMovement = (
  initialGridX: number,
  initialGridY: number,
  endGridX: number,
  endGridY: number
): any => {
  return {
    x: FromGridX(initialGridX),
    y: FromGridX(initialGridY),
    direction: "down" as AnimationDirection,
    alignment: NPCAlignment.Neutral,
    class: CharacterClass.None,
    layer: MapLayers.Player,
    movementType: NPCMovementType.FixedPath,
    fixedPathOrientation: FixedPathOrientation.Forward, // must be forward!
    fixedPath: {
      endGridX: endGridX,
      endGridY: endGridY,
    },

    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};
