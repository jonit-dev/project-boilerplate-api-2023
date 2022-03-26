import { CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../npcs/abstractions/BaseNeutralNPC";

export const mockNPC = {
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
