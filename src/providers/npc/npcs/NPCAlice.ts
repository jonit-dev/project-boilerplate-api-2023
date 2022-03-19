import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateFixedPathMovementNPC } from "./abstractions/BaseNeutralNPC";

export const aliceMetaData = {
  ...generateFixedPathMovementNPC(8, 10, 24, 9),
  key: "alice",
  name: "Alice",
  textureKey: "female-npc",
  scene: "MainScene",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
};
