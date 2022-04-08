import { CharacterGender, FixedPathOrientation, NPCMovementType } from "@rpg-engine/shared";
import { generateFixedPathMovement, generateRandomMovement } from "../../npc/npcs/abstractions/BaseNeutralNPC";

export const randomMovementMockNPC = {
  ...generateRandomMovement(),
  key: "test-npc",
  name: "Test NPC",
  textureKey: "female-npc",
  gender: CharacterGender.Female,
  x: 144,
  y: 128,
  socketTransmissionZone: {
    x: -648,
    y: -664,
    width: 936,
    height: 920,
  },
  scene: "MainScene",
  tiledId: 0,
};

export const fixedPathMockNPC = {
  ...generateFixedPathMovement(),
  key: "test-npc",
  name: "Test NPC",
  textureKey: "female-npc",
  gender: CharacterGender.Female,
  x: 144,
  y: 128,
  socketTransmissionZone: {
    x: -648,
    y: -664,
    width: 936,
    height: 920,
  },
  scene: "MainScene",
  tiledId: 0,
  currentMovementType: NPCMovementType.FixedPath,
  originalMovementType: NPCMovementType.FixedPath,
  fixedPath: {
    endGridX: 9,
    endGridY: 11,
  },
  fixedPathOrientation: FixedPathOrientation.Forward, // must be forward!
  maxRangeInGridCells: 20,
};
