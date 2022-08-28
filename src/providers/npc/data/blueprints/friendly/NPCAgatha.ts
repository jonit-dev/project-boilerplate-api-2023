import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateStoppedMovement } from "../../abstractions/BaseNeutralNPC";

export const npcAgatha = {
  ...generateStoppedMovement(),
  name: "Agatha",
  textureKey: "woman-1",
  key: FriendlyNPCsBlueprint.Agatha,
  class: CharacterClass.None,
  gender: CharacterGender.Female,
  scene: "ilya",
} as Partial<INPC>;
