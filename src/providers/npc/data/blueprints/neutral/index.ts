import { NeutralNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";

import { npcDeer } from "./NPCDeer";
import { npcGiantBrownRabbit } from "./NPCGiantBrownRabbit";
import { npcGiantGrayRabbit } from "./NPCGiantGrayRabbit";
import { npcGiantWhiteRabbit } from "./NPCGiantWhiteRabbit";

import { npcRedDeer } from "./NPCRedDeer";

export const neutralNPCs = {
  [NeutralNPCsBlueprint.Deer]: npcDeer,
  [NeutralNPCsBlueprint.GiantBrownRabbit]: npcGiantBrownRabbit,
  [NeutralNPCsBlueprint.GiantWhiteRabbit]: npcGiantWhiteRabbit,
  [NeutralNPCsBlueprint.GiantGrayRabbit]: npcGiantGrayRabbit,
  [NeutralNPCsBlueprint.RedDeer]: npcRedDeer,
};
