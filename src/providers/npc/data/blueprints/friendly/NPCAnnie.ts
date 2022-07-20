import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateMoveAwayMovement } from "../../abstractions/BaseNeutralNPC";

export const npcAnnie = {
  ...generateMoveAwayMovement(),
  name: "Annie",
  textureKey: "woman-1",
  key: FriendlyNPCsBlueprint.Annie,
  class: CharacterClass.None,
  gender: CharacterGender.Female,
} as Partial<INPC>;
