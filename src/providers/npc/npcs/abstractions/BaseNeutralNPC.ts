import { appEnv } from "@providers/config/env";
import {
  AnimationDirection,
  CharacterClass,
  FixedPathOrientation,
  MapLayers,
  NPCAlignment,
  NPCMovementType,
} from "@rpg-engine/shared";
import _ from "lodash";

export const generateRandomMovement = (): any => {
  return {
    direction: "down" as AnimationDirection,
    alignment: NPCAlignment.Neutral,
    class: CharacterClass.None,
    layer: MapLayers.Character,
    movementType: NPCMovementType.Random,
    maxRangeInGridCells: 5,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};

export const generateMoveTowardsMovement = (): any => {
  return {
    direction: "down" as AnimationDirection,
    alignment: NPCAlignment.Neutral,
    class: CharacterClass.None,
    layer: MapLayers.Character,
    movementType: NPCMovementType.MoveTowards,
    maxRangeInGridCells: 20,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};

export const generateStoppedMovement = (): any => {
  return {
    direction: "down" as AnimationDirection,
    alignment: NPCAlignment.Neutral,
    class: CharacterClass.None,
    layer: MapLayers.Character,
    movementType: NPCMovementType.Stopped,
    maxRangeInGridCells: 5,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};

export const generateMoveAwayMovement = (): any => {
  return {
    direction: "down" as AnimationDirection,
    alignment: NPCAlignment.Neutral,
    class: CharacterClass.None,
    layer: MapLayers.Character,
    movementType: NPCMovementType.MoveAway,
    maxRangeInGridCells: 20,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};

export const generateFixedPathMovement = (): any => {
  return {
    direction: "down" as AnimationDirection,
    alignment: NPCAlignment.Neutral,
    class: CharacterClass.None,
    layer: MapLayers.Character,
    movementType: NPCMovementType.FixedPath,
    fixedPathOrientation: FixedPathOrientation.Forward, // must be forward!
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};
