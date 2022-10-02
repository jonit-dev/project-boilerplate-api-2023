import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NeutralNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { generateMoveAwayMovement } from "../../abstractions/BaseNeutralNPC";
import { npcGiantBrownRabbit } from "./NPCGiantBrownRabbit";

export const npcGiantWhiteRabbit = {
  ...generateMoveAwayMovement(),
  name: "Giant Rabbit",
  ...npcGiantBrownRabbit,
  key: NeutralNPCsBlueprint.GiantWhiteRabbit,
  textureKey: NeutralNPCsBlueprint.GiantWhiteRabbit,
} as Partial<INPC>;
