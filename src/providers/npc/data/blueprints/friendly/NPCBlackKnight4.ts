import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBlackKnight4 = {
  ...generateRandomMovement(),
  name: "Knight",
  textureKey: FriendlyNPCsBlueprint.BlackKnight4,
  key: FriendlyNPCsBlueprint.BlackKnight4,
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
