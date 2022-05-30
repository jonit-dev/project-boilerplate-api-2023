import { INPC } from "@entities/ModuleNPC/NPCModel";
import { appEnv } from "@providers/config/env";
import {
  AnimationDirection,
  CharacterClass,
  MapLayers,
  NPCAlignment,
  NPCMovementType,
  NPCPathOrientation,
} from "@rpg-engine/shared";
import _ from "lodash";

const baseNPCProperties: Partial<INPC> = {
  direction: "down" as AnimationDirection,
  alignment: NPCAlignment.Neutral,
  class: CharacterClass.None,
  layer: MapLayers.Character,
  spawnIntervalMin: 1,
};

export const generateRandomMovement = (): any => {
  return {
    ...baseNPCProperties,
    originalMovementType: NPCMovementType.Random,
    currentMovementType: NPCMovementType.Random,
    maxRangeInGridCells: 5,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};

export const generateMoveTowardsMovement = (): any => {
  return {
    ...baseNPCProperties,
    originalMovementType: NPCMovementType.MoveTowards,
    currentMovementType: NPCMovementType.MoveTowards,
    maxRangeInGridCells: 10,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
    pathOrientation: NPCPathOrientation.Forward, // must be forward!
  };
};

export const generateStoppedMovement = (): any => {
  return {
    ...baseNPCProperties,
    currentMovementType: NPCMovementType.Stopped,
    originalMovementType: NPCMovementType.Stopped,
    maxRangeInGridCells: 5,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};

export const generateMoveAwayMovement = (): any => {
  return {
    ...baseNPCProperties,
    currentMovementType: NPCMovementType.MoveAway,
    originalMovementType: NPCMovementType.MoveAway,
    maxRangeInGridCells: 20,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};

export const generateFixedPathMovement = (): any => {
  return {
    ...baseNPCProperties,
    currentMovementType: NPCMovementType.FixedPath,
    originalMovementType: NPCMovementType.FixedPath,
    pathOrientation: NPCPathOrientation.Forward, // must be forward!
    maxRangeInGridCells: 20,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};
