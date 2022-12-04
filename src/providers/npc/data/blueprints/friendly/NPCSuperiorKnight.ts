import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcSuperiorKnight = {
  ...generateRandomMovement(),
  name: "Superior Knight",
  textureKey: FriendlyNPCsBlueprint.SuperiorKnight,
  key: FriendlyNPCsBlueprint.SuperiorKnight,
  class: CharacterClass.None,
  gender: CharacterGender.Male,
} as Partial<INPC>;
