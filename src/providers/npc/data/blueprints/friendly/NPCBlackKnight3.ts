import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBlackKnight3 = {
  ...generateRandomMovement(),
  name: "Knight",
  textureKey: FriendlyNPCsBlueprint.BlackKnight3,
  key: FriendlyNPCsBlueprint.BlackKnight3,
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
