import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBaseRandomPath = {
  ...generateRandomMovement(),
  key: FriendlyNPCsBlueprint.BaseRandomPath,
  speed: MovementSpeed.ExtraSlow,
} as Partial<INPC>;
