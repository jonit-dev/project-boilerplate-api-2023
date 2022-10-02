import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NeutralNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { generateMoveAwayMovement } from "../../abstractions/BaseNeutralNPC";
import { npcWhiteSheep } from "./NPCWhiteSheep";

export const npcBlackWhiteSheep = {
  ...generateMoveAwayMovement(),
  name: "Sheep",
  ...npcWhiteSheep,
  key: NeutralNPCsBlueprint.BlackWhiteSheep,
  textureKey: NeutralNPCsBlueprint.BlackWhiteSheep,
} as Partial<INPC>;
