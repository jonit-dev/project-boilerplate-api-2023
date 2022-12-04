import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcHumanGirl3 = {
  ...generateRandomMovement(),
  name: "Zofia",
  textureKey: FriendlyNPCsBlueprint.HumanGirl3,
  key: FriendlyNPCsBlueprint.HumanGirl3,
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
