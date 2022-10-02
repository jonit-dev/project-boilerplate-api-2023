import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NeutralNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { generateMoveAwayMovement } from "../../abstractions/BaseNeutralNPC";
import { npcGiantBrownRabbit } from "./NPCGiantBrownRabbit";

export const npcGiantGrayRabbit = {
  ...generateMoveAwayMovement(),
  name: "Giant Rabbit",
  ...npcGiantBrownRabbit,
  key: NeutralNPCsBlueprint.GiantGrayRabbit,
  textureKey: NeutralNPCsBlueprint.GiantGrayRabbit,
} as Partial<INPC>;
