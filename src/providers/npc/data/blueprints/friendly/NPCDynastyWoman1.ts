import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcDynastyWoman1 = {
  ...generateRandomMovement(),
  name: "Elizabeth",
  textureKey: FriendlyNPCsBlueprint.DynastyWoman1,
  key: FriendlyNPCsBlueprint.DynastyWoman1,
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
