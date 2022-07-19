import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateFixedPathMovement } from "../../abstractions/BaseNeutralNPC";

export const npcWomanBlueHair = {
  ...generateFixedPathMovement(),
  name: "Linda",
  textureKey: "woman-blue-hair",
  key: "woman-blue-hair",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
} as Partial<INPC>;
