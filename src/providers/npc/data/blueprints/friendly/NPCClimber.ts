import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcClimber = {
  ...generateRandomMovement(),
  key: FriendlyNPCsBlueprint.Climber,
  name: "Climber",
  textureKey: FriendlyNPCsBlueprint.HumanMale1,
  gender: CharacterGender.Male,
} as Partial<INPC>;
