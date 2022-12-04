import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcHumanMale2 = {
  ...generateRandomMovement(),
  name: "Antonio",
  textureKey: FriendlyNPCsBlueprint.HumanMale2,
  key: FriendlyNPCsBlueprint.HumanMale2,
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
