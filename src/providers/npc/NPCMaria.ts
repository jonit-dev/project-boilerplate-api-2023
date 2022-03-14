import { CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovementNPC } from "./abstractions/BaseNeutralNPC";

export const mariaNPCMetaData = {
  ...generateRandomMovementNPC(22, 12),
  key: "maria",
  name: "Maria",
  textureKey: "female-npc",
  scene: "MainScene",
  gender: CharacterGender.Female,
};