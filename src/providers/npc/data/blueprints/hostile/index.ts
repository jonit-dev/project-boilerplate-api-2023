import { npcBat } from "./NPCBat";
import { npcBrownBear } from "./NPCBrownBear";
import { npcCaveTroll } from "./NPCCaveTroll";
import { npcDwarf } from "./NPCDwarf";
import { npcDwarfGuard } from "./NPCDwarfGuard";
import { npcForestTroll } from "./NPCForestTroll";
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
import { npcWolf } from "./NPCWolf";

export const hostileNPCs = {
  orc: npcOrc,
  "orc-warrior": npcOrcWarrior,
  "orc-berserker": npcOrcBerserker,
  "orc-mage": npcOrcMage,
  skeleton: npcSkeleton,
  rat: npcRat,
  "skeleton-knight": npcSkeletonKnight,
  bat: npcBat,
  ghost: npcGhost,
  minotaur: npcMinotaur,
  slime: npcSlime,
  wolf: npcWolf,
  ghoul: npcGhoul,
  spider: npcSpider,
  dwarf: npcDwarf,
  "dwarf-guard": npcDwarfGuard,
  "red-dragon": npcRedDragon,
  troll: npcTroll,
  "wild-troll": npcWildTroll,
  "troll-warrior": npcTrollWarrior,
  "troll-berserker": npcTrollBerserker,
  "forest-troll": npcForestTroll,
  "cave-troll": npcCaveTroll,
  goblin: npcGoblin,
  "brown-bear": npcBrownBear,
  "panda-bear": npcPandaBear,
  "polar-bear": npcPolarBear,
};
