import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcMaria = {
  ...generateRandomMovement(),
  name: "Maria",
  key: FriendlyNPCsBlueprint.Maria,
  textureKey: "woman-1",
  gender: CharacterGender.Female,
} as Partial<INPC>;
