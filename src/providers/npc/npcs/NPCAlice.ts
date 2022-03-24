import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateFixedPathMovement } from "./abstractions/BaseNeutralNPC";

export const npcAliceMetaData = {
  ...generateFixedPathMovement(8, 10, 24, 9),
  key: "alice",
  name: "Alice",
  textureKey: "female-npc",
  scene: "MainScene",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
};
