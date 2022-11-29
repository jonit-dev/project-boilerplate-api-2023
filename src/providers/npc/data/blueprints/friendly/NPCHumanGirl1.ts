import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcHumanGirl1 = {
  ...generateRandomMovement(),
  name: "Marrie",
  textureKey: FriendlyNPCsBlueprint.HumanGirl1,
  key: FriendlyNPCsBlueprint.HumanGirl1,
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
