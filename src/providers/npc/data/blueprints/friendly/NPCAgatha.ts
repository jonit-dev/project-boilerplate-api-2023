import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateStoppedMovement } from "../../abstractions/BaseNeutralNPC";

export const npcAgatha = {
  ...generateStoppedMovement(),
  name: "Agatha",
  textureKey: "woman-1",
  key: "agatha",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
  scene: "Ilya",
} as Partial<INPC>;
