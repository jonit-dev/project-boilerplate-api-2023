import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateFixedPathMovementNPC } from "./abstractions/BaseNeutralNPC";

export const aliceMetaData = {
  ...generateFixedPathMovementNPC(22, 12, 7, 5),
  key: "alice",
  name: "Alice",
  textureKey: "female-npc",
  scene: "MainScene",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
};
