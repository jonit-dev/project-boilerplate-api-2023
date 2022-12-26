import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { generateFixedPathMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBaseFixedPath = {
  ...generateFixedPathMovement(),
  name: "Alice",
  textureKey: "woman-1",
  key: FriendlyNPCsBlueprint.BaseFixedPath,
} as Partial<INPC>;
