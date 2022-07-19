import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcTrader = {
  ...generateRandomMovement(),
  key: "trader",
  name: "Joe",
  textureKey: "trader",
  gender: CharacterGender.Male,
} as Partial<INPC>;
