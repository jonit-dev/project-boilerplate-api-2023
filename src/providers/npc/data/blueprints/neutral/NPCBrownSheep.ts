import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NeutralNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { generateMoveAwayMovement } from "../../abstractions/BaseNeutralNPC";
import { npcWhiteSheep } from "./NPCWhiteSheep";

export const npcBrownSheep = {
  ...generateMoveAwayMovement(),
  name: "Sheep",
  ...npcWhiteSheep,
  key: NeutralNPCsBlueprint.BrownSheep,
  textureKey: NeutralNPCsBlueprint.BrownSheep,
} as Partial<INPC>;
