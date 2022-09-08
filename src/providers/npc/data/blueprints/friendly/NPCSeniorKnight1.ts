import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcSeniorKnight = {
  ...generateRandomMovement(),
  name: "Senior Knight",
  textureKey: FriendlyNPCsBlueprint.SeniorKnight1,
  key: FriendlyNPCsBlueprint.SeniorKnight1,
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
