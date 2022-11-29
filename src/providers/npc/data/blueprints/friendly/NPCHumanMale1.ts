import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcHumanMale1 = {
  ...generateRandomMovement(),
  name: "Michael",
  textureKey: FriendlyNPCsBlueprint.HumanMale1,
  key: FriendlyNPCsBlueprint.HumanMale1,
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
