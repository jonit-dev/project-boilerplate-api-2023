import { CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "./abstractions/BaseNeutralNPC";

export const mariaNPCMetaData = {
  ...generateRandomMovement(20, 12),
  key: "maria",
  name: "Maria",
  textureKey: "female-npc",
  scene: "MainScene",
  gender: CharacterGender.Female,
};
