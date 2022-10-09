import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { npcBandit } from "./NPCBandit";
import { npcBat } from "./NPCBat";
import { npcBrownBear } from "./NPCBrownBear";
import { npcCaveTroll } from "./NPCCaveTroll";
import { npcDwarf } from "./NPCDwarf";
import { npcDwarfGuard } from "./NPCDwarfGuard";
import { npcForestTroll } from "./NPCForestTroll";
import { npcFrostSalamander } from "./NPCFrostSalamander";
import { npcGhost } from "./NPCGhost";
import { npcGhoul } from "./NPCGhoul";
import { npcGoblin } from "./NPCGoblin";
import { npcMinotaur } from "./NPCMinotaur";
import { npcOrc } from "./NPCOrc";
import { npcOrcBerserker } from "./NPCOrcBerserker";
import { npcOrcMage } from "./NPCOrcMage";
import { npcOrcWarrior } from "./NPCOrcWarrior";
import { npcPandaBear } from "./NPCPandaBear";
import { npcPolarBear } from "./NPCPolarBear";
import { npcRat } from "./NPCRat";
import { npcRedDragon } from "./NPCRedDragon";
import { npcSkeleton } from "./NPCSkeleton";
import { npcSkeletonKnight } from "./NPCSkeletonKnight";
import { npcSlime } from "./NPCSlime";
import { npcSpider } from "./NPCSpider";
import { npcTroll } from "./NPCTroll";
import { npcTrollBerserker } from "./NPCTrollBerserker";
import { npcTrollWarrior } from "./NPCTrollWarrior";
import { npcWildTroll } from "./NPCWildTroll";
import { npcWinterWolf } from "./NPCWinterWolf";
import { npcWolf } from "./NPCWolf";

export const hostileNPCs = {
  [HostileNPCsBlueprint.Orc]: npcOrc,
  [HostileNPCsBlueprint.OrcWarrior]: npcOrcWarrior,
  [HostileNPCsBlueprint.OrcBerserker]: npcOrcBerserker,
  [HostileNPCsBlueprint.OrcMage]: npcOrcMage,
  [HostileNPCsBlueprint.Skeleton]: npcSkeleton,
  [HostileNPCsBlueprint.Rat]: npcRat,
  [HostileNPCsBlueprint.SkeletonKnight]: npcSkeletonKnight,
  [HostileNPCsBlueprint.Bat]: npcBat,
  [HostileNPCsBlueprint.Ghost]: npcGhost,
  [HostileNPCsBlueprint.Minotaur]: npcMinotaur,
  [HostileNPCsBlueprint.Slime]: npcSlime,
  [HostileNPCsBlueprint.Wolf]: npcWolf,
  [HostileNPCsBlueprint.Ghoul]: npcGhoul,
  [HostileNPCsBlueprint.Spider]: npcSpider,
  [HostileNPCsBlueprint.Dwarf]: npcDwarf,
  [HostileNPCsBlueprint.DwarfGuard]: npcDwarfGuard,
  [HostileNPCsBlueprint.RedDragon]: npcRedDragon,
  [HostileNPCsBlueprint.Troll]: npcTroll,
  [HostileNPCsBlueprint.WildTroll]: npcWildTroll,
  [HostileNPCsBlueprint.TrollWarrior]: npcTrollWarrior,
  [HostileNPCsBlueprint.TrollBerserker]: npcTrollBerserker,
  [HostileNPCsBlueprint.ForestTroll]: npcForestTroll,
  [HostileNPCsBlueprint.CaveTroll]: npcCaveTroll,
  [HostileNPCsBlueprint.Goblin]: npcGoblin,
  [HostileNPCsBlueprint.BrownBear]: npcBrownBear,
  [HostileNPCsBlueprint.PandaBear]: npcPandaBear,
  [HostileNPCsBlueprint.PolarBear]: npcPolarBear,
  [HostileNPCsBlueprint.WinterWolf]: npcWinterWolf,
  [HostileNPCsBlueprint.FrostSalamander]: npcFrostSalamander,
  [HostileNPCsBlueprint.Bandit]: npcBandit,
};
