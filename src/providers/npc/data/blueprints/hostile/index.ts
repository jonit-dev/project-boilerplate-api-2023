import { npcBat } from "./NPCBat";
import { npcDwarf } from "./NPCDwarf";
import { npcDwarfGuard } from "./NPCDwarfGuard";
import { npcGhost } from "./NPCGhost";
import { npcGhoul } from "./NPCGhoul";
import { npcMinotaur } from "./NPCMinotaur";
import { npcOrc } from "./NPCOrc";
import { npcOrcBerserker } from "./NPCOrcBerserker";
import { npcOrcMage } from "./NPCOrcMage";
import { npcOrcWarrior } from "./NPCOrcWarrior";
import { npcRat } from "./NPCRat";
import { npcRedDragon } from "./NPCRedDragon";
import { npcSkeleton } from "./NPCSkeleton";
import { npcSkeletonKnight } from "./NPCSkeletonKnight";
import { npcSlime } from "./NPCSlime";
import { npcSpider } from "./NPCSpider";
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
};
