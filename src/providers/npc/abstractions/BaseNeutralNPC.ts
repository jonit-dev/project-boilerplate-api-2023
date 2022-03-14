import { appEnv } from "@providers/config/env";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import {
  AnimationDirection,
  CharacterClass,
  FixedPathOrientation,
  FromGridX,
  FromGridY,
  GRID_HEIGHT,
  GRID_WIDTH,
  MapLayers,
  NPCAlignment,
  NPCMovementType,
  SOCKET_TRANSMISSION_ZONE_WIDTH,
} from "@rpg-engine/shared";
import _ from "lodash";

export const generateRandomMovementNPC = (initialGridX: number, initialGridY: number): any => {
  const { top, left, bottom, right } = SocketTransmissionZone.calculateSocketTransmissionZone(
    FromGridX(initialGridX),
    FromGridY(initialGridY),
    GRID_WIDTH,
    GRID_HEIGHT,
    SOCKET_TRANSMISSION_ZONE_WIDTH,
    SOCKET_TRANSMISSION_ZONE_WIDTH
  );

  return {
    x: FromGridX(initialGridX),
    y: FromGridY(initialGridY),
    direction: "down" as AnimationDirection,
    alignment: NPCAlignment.Neutral,
    class: CharacterClass.None,
    layer: MapLayers.Player,
    movementType: NPCMovementType.Random,
    maxRangeInGridCells: GRID_WIDTH * 5,
    pm2InstanceManager: _.random(0, appEnv.general.MAX_PM2_INSTANCES - 1),
    socketTransmissionZone: {
      x: left,
      y: top,
      width: right,
      height: bottom,
    },
  };
};

export const generateFixedPathMovementNPC = (
  initialGridX: number,
  initialGridY: number,
  endGridX: number,
  endGridY: number
): any => {
  const { top, left, bottom, right } = SocketTransmissionZone.calculateSocketTransmissionZone(
    FromGridX(initialGridX),
    FromGridY(initialGridY),
    GRID_WIDTH,
    GRID_HEIGHT,
    SOCKET_TRANSMISSION_ZONE_WIDTH,
    SOCKET_TRANSMISSION_ZONE_WIDTH
  );

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
    socketTransmissionZone: {
      x: left,
      y: top,
      width: right,
      height: bottom,
    },
  };
};
