import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateFixedPathMovement } from "../../abstractions/BaseNeutralNPC";

export const npcAlice = {
  ...generateFixedPathMovement(),
  name: "Alice",
  textureKey: "woman-1",
  key: FriendlyNPCsBlueprint.Alice,
  class: CharacterClass.None,
  gender: CharacterGender.Female,
} as Partial<INPC>;
