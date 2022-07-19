import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateFixedPathMovement } from "../../abstractions/BaseNeutralNPC";

export const npcKnight1 = {
  ...generateFixedPathMovement(),
  name: "Knight",
  textureKey: "knight-1",
  key: "knight-1",
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
