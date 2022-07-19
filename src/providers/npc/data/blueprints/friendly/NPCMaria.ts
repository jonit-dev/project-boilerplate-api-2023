import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcMaria = {
  ...generateRandomMovement(),
  name: "Maria",
  key: "maria",
  textureKey: "woman-1",
  gender: CharacterGender.Female,
} as Partial<INPC>;
