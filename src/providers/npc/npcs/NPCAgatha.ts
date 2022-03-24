import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateStoppedMovement } from "./abstractions/BaseNeutralNPC";

export const npcAgathaMetaData = {
  ...generateStoppedMovement(),
  key: "agatha",
  name: "Agatha",
  textureKey: "female-npc",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
};
