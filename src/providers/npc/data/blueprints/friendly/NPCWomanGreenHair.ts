import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcWomanGreenHair = {
  ...generateRandomMovement(),
  name: "Sasha",
  textureKey: FriendlyNPCsBlueprint.WomanGreenHair,
  key: FriendlyNPCsBlueprint.WomanGreenHair,
  class: CharacterClass.None,
  gender: CharacterGender.Female,
} as Partial<INPC>;
