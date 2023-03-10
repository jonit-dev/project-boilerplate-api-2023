import { NeutralNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { npcBlackWhiteSheep } from "./NPCBlackWhiteSheep";
import { npcBrownSheep } from "./NPCBrownSheep";
import { npcDeer } from "./NPCDeer";
import { npcGiantBrownRabbit } from "./NPCGiantBrownRabbit";
import { npcGiantGrayRabbit } from "./NPCGiantGrayRabbit";
import { npcGiantWhiteRabbit } from "./NPCGiantWhiteRabbit";
import { npcPig } from "./NPCPig";
import { npcRedDeer } from "./NPCRedDeer";
import { npcWhiteSheep } from "./NPCWhiteSheep";

export const neutralNPCsIndex = {
  [NeutralNPCsBlueprint.Deer]: npcDeer,
  [NeutralNPCsBlueprint.Pig]: npcPig,
  [NeutralNPCsBlueprint.GiantBrownRabbit]: npcGiantBrownRabbit,
  [NeutralNPCsBlueprint.GiantWhiteRabbit]: npcGiantWhiteRabbit,
  [NeutralNPCsBlueprint.GiantGrayRabbit]: npcGiantGrayRabbit,
  [NeutralNPCsBlueprint.BrownSheep]: npcBrownSheep,
  [NeutralNPCsBlueprint.BlackWhiteSheep]: npcBlackWhiteSheep,
  [NeutralNPCsBlueprint.WhiteSheep]: npcWhiteSheep,
  [NeutralNPCsBlueprint.RedDeer]: npcRedDeer,
};
