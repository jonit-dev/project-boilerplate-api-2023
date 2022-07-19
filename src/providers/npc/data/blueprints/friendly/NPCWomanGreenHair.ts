import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcWomanGreenHair = {
  ...generateRandomMovement(),
  name: "Sasha",
  textureKey: "woman-green-hair",
  key: "woman-green-hair",
  class: CharacterClass.None,
  gender: CharacterGender.Female,
} as Partial<INPC>;
