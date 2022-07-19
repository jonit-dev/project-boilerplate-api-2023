import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcFatBaldMan = {
  ...generateRandomMovement(),
  key: "fat-bald-man",
  name: "Heather",
  textureKey: "fat-bald-man",
  gender: CharacterGender.Male,
} as Partial<INPC>;
