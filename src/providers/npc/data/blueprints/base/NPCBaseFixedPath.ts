import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { generateFixedPathMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBaseFixedPath = {
  ...generateFixedPathMovement(),
  key: FriendlyNPCsBlueprint.BaseFixedPath,
} as Partial<INPC>;
