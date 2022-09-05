import { INPC } from "@entities/ModuleNPC/NPCModel";
import { appEnv } from "@providers/config/env";
import { AnimationDirection, CharacterClass, MapLayers, NPCMovementType, NPCPathOrientation } from "@rpg-engine/shared";
import _ from "lodash";

const generateBaseNPCProperties = (): Partial<INPC> => {
  return {
    direction: "down" as AnimationDirection,
    class: CharacterClass.None,
    layer: MapLayers.Character,
    spawnIntervalMin: 1,
    speed: _.random(1, 2),
  };
};

export const generateRandomMovement = (): any => {
  return {
    ...generateBaseNPCProperties(),
    originalMovementType: NPCMovementType.Random,
    currentMovementType: NPCMovementType.Random,
    maxRangeInGridCells: 5,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};

export const generateMoveTowardsMovement = (): any => {
  return {
    ...generateBaseNPCProperties(),
    originalMovementType: NPCMovementType.MoveTowards,
    currentMovementType: NPCMovementType.MoveTowards,
    maxRangeInGridCells: 30,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
    pathOrientation: NPCPathOrientation.Forward, // must be forward!
  };
};

export const generateStoppedMovement = (): any => {
  return {
    ...generateBaseNPCProperties(),
    currentMovementType: NPCMovementType.Stopped,
    originalMovementType: NPCMovementType.Stopped,
    maxRangeInGridCells: 5,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};

export const generateMoveAwayMovement = (): any => {
  return {
    ...generateBaseNPCProperties(),
    currentMovementType: NPCMovementType.MoveAway,
    originalMovementType: NPCMovementType.MoveAway,
    maxRangeInGridCells: 20,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};

export const generateFixedPathMovement = (): any => {
  return {
    ...generateBaseNPCProperties(),
    currentMovementType: NPCMovementType.FixedPath,
    originalMovementType: NPCMovementType.FixedPath,
    pathOrientation: NPCPathOrientation.Forward, // must be forward!
    maxRangeInGridCells: 20,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
  };
};
