import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateFixedPathMovement } from "../../abstractions/BaseNeutralNPC";

export const npcWomanBlueHair = {
  ...generateFixedPathMovement(),
  name: "Linda",
  textureKey: FriendlyNPCsBlueprint.WomanBlueHair,
  key: FriendlyNPCsBlueprint.WomanBlueHair,
  class: CharacterClass.None,
  gender: CharacterGender.Female,
} as Partial<INPC>;
