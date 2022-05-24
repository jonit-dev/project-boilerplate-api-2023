import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateStoppedMovement } from "../abstractions/BaseNeutralNPC";

export const npcAgatha = {
  ...generateStoppedMovement(),
  name: "Agatha",
  textureKey: "female-npc",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
} as Partial<INPC>;
