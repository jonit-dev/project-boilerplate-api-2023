import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { generateStoppedMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBaseStopped = {
  ...generateStoppedMovement(),
  key: FriendlyNPCsBlueprint.BaseStopped,
} as Partial<INPC>;
