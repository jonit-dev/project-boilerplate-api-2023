import { NeutralNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { npcDeer } from "./NPCDeer";
import { npcGiantBrownRabbit } from "./NPCGiantBrownRabbit";
import { npcGiantGrayRabbit } from "./NPCGiantGrayRabbit";
import { npcGiantWhiteRabbit } from "./NPCGiantWhiteRabbit";
import { npcPig } from "./NPCPig";

export const neutralNPCs = {
  [NeutralNPCsBlueprint.Deer]: npcDeer,
  [NeutralNPCsBlueprint.Pig]: npcPig,
  [NeutralNPCsBlueprint.GiantBrownRabbit]: npcGiantBrownRabbit,
  [NeutralNPCsBlueprint.GiantWhiteRabbit]: npcGiantWhiteRabbit,
  [NeutralNPCsBlueprint.GiantGrayRabbit]: npcGiantGrayRabbit,
};
