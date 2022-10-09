import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateFixedPathMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBlackKnight = {
  ...generateFixedPathMovement(),
  name: "Knight",
  textureKey: FriendlyNPCsBlueprint.BlackKnight,
  key: FriendlyNPCsBlueprint.BlackKnight,
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
