import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBlackKnight2 = {
  ...generateRandomMovement(),
  name: "Knight",
  textureKey: FriendlyNPCsBlueprint.BlackKnight2,
  key: FriendlyNPCsBlueprint.BlackKnight2,
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
