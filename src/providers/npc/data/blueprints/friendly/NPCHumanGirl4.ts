import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcHumanGirl4 = {
  ...generateRandomMovement(),
  name: "Hannah",
  textureKey: FriendlyNPCsBlueprint.HumanGirl4,
  key: FriendlyNPCsBlueprint.HumanGirl4,
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
