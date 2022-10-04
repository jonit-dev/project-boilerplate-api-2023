import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcFatBaldMan = {
  ...generateRandomMovement(),
  key: FriendlyNPCsBlueprint.FatBaldMan,
  name: "Heather",
  textureKey: FriendlyNPCsBlueprint.FatBaldMan,
  gender: CharacterGender.Male,
} as Partial<INPC>;
