import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcFelicia = {
  ...generateMoveTowardsMovement(),
  name: "Felicia",
  textureKey: "woman-1",
  key: FriendlyNPCsBlueprint.Felicia,
  class: CharacterClass.None,
  gender: CharacterGender.Female,
  scene: "ilya",
} as Partial<INPC>;
