import { CharacterGender, NPCMovementType, NPCPathOrientation } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import {
  generateFixedPathMovement,
  generateMoveAwayMovement,
  generateMoveTowardsMovement,
  generateRandomMovement,
  generateStoppedMovement,
} from "../../npc/data/abstractions/BaseNeutralNPC";

// TODO: Refactor to use common baseNPCMock (avoid repetitive props)

export const randomMovementMockNPC = {
  ...generateRandomMovement(),
  key: "test-npc-22",
  name: "Test NPC",
  textureKey: "woman-1",
  gender: CharacterGender.Female,
  x: 144,
  y: 128,
  initialX: 144,
  initialY: 128,
  socketTransmissionZone: {
    x: -648,
    y: -664,
    width: 936,
    height: 920,
  },
  scene: "example",
  tiledId: 0,
  spawnIntervalMin: 1,
  attackType: EntityAttackType.Melee,
};

export const stoppedMovementMockNPC = {
  ...generateStoppedMovement(),
  key: "test-npc-22",
  name: "Test NPC",
  textureKey: "woman-1",
  gender: CharacterGender.Female,
  x: 0,
  y: 0,
  initialX: 0,
  initialY: 0,
  socketTransmissionZone: {
    x: -648,
    y: -664,
    width: 936,
    height: 920,
  },
  scene: "example",
  tiledId: 0,
  spawnIntervalMin: 1,
  attackType: EntityAttackType.Melee,
};

export const moveAwayMockNPC = {
  ...generateMoveAwayMovement(),
  key: "test-npc-22",
  name: "Test NPC",
  textureKey: "woman-1",
  gender: CharacterGender.Female,
  x: 0,
  y: 0,
  initialX: 0,
  initialY: 0,
  socketTransmissionZone: {
    x: -648,
    y: -664,
    width: 936,
    height: 920,
  },
  scene: "example",
  tiledId: 0,
  spawnIntervalMin: 1,
  maxAntiLuringRangeInGridCells: 100,
  attackType: EntityAttackType.Melee,
};

export const moveTowardsMockNPC = {
  ...generateMoveTowardsMovement(),
  key: "test-npc-22",
  name: "Test NPC",
  textureKey: "woman-1",
  gender: CharacterGender.Female,
  x: 0,
  y: 0,
  initialX: 0,
  initialY: 0,
  socketTransmissionZone: {
    x: -648,
    y: -664,
    width: 936,
    height: 920,
  },
  maxRangeInGridCells: 10,
  maxAntiLuringRangeInGridCells: 100,
  scene: "example",
  tiledId: 0,
  spawnIntervalMin: 1,
  attackType: EntityAttackType.Melee,
};

export const fixedPathMockNPC = {
  ...generateFixedPathMovement(),
  key: "test-npc-22",
  name: "Test NPC",
  textureKey: "woman-1",
  gender: CharacterGender.Female,
  x: 144,
  y: 128,
  initialX: 144,
  initialY: 128,
  socketTransmissionZone: {
    x: -648,
    y: -664,
    width: 936,
    height: 920,
  },
  scene: "example",
  tiledId: 0,
  currentMovementType: NPCMovementType.FixedPath,
  originalMovementType: NPCMovementType.FixedPath,
  fixedPath: {
    endGridX: 9,
    endGridY: 11,
  },
  pathOrientation: NPCPathOrientation.Forward, // must be forward!
  maxRangeInGridCells: 20,
  maxAntiLuringRangeInGridCells: 100,
  spawnIntervalMin: 1,
  attackType: EntityAttackType.Melee,
};
