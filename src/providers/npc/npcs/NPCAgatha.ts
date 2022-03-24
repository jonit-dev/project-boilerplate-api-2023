import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateStoppedMovement } from "./abstractions/BaseNeutralNPC";

export const npcAgathaMetaData = {
  ...generateStoppedMovement(14, 27),
  key: "agatha",
  name: "Agatha",
  textureKey: "female-npc",
  scene: "MainScene",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
};
