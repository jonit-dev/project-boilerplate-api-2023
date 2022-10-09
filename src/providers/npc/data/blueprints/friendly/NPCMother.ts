import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcMother = {
  ...generateRandomMovement(),
  key: FriendlyNPCsBlueprint.Mother,
  name: "Mother",
  textureKey: "woman-1",
  gender: CharacterGender.Female,
} as Partial<INPC>;
