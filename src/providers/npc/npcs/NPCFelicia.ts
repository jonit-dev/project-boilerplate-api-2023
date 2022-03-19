import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateMoveTowardsMovement } from "./abstractions/BaseNeutralNPC";

export const feliciaMetaData = {
  ...generateMoveTowardsMovement(14, 46),
  key: "felicia",
  name: "Felicia",
  textureKey: "female-npc",
  scene: "MainScene",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
};
