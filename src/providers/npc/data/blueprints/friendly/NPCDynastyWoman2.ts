import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcDynastyWoman2 = {
  ...generateRandomMovement(),
  name: "Kate",
  textureKey: FriendlyNPCsBlueprint.DynastyWoman2,
  key: FriendlyNPCsBlueprint.DynastyWoman2,
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
