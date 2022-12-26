import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcFisherman = {
  ...generateRandomMovement(),
  key: FriendlyNPCsBlueprint.Fisherman,
  name: "Fisherman",
  textureKey: FriendlyNPCsBlueprint.HumanMale2,
  gender: CharacterGender.Male,
} as Partial<INPC>;
