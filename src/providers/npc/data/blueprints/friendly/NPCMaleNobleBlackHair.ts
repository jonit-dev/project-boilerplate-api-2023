import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateFixedPathMovement } from "../../abstractions/BaseNeutralNPC";

export const npcMaleNobleBlackHair = {
  ...generateFixedPathMovement(),
  name: "Gabriel",
  textureKey: "male-noble-black-hair",
  key: "male-noble-black-hair",
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
