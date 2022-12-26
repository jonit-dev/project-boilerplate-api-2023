import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBaseRandomPath = {
  ...generateRandomMovement(),
  name: "Maria",
  key: FriendlyNPCsBlueprint.BaseRandomPath,
  textureKey: "woman-1",
} as Partial<INPC>;
