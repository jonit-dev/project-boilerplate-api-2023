import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateMoveTowardsMovement } from "../abstractions/BaseNeutralNPC";

export const npcFelicia = {
  ...generateMoveTowardsMovement(),
  name: "Felicia",
  textureKey: "woman-1",
  scene: "Ilya",
  key: "felicia",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
} as Partial<INPC>;
