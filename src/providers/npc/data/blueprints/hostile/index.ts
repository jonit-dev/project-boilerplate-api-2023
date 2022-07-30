import { npcBat } from "./NPCBat";
import { npcGhost } from "./NPCGhost";
import { npcGhoul } from "./NPCGhoul";
import { npcMinotaur } from "./NPCMinotaur";
import { npcOrc } from "./NPCOrc";
import { npcRat } from "./NPCRat";
import { npcSkeleton } from "./NPCSkeleton";
import { npcSkeletonKnight } from "./NPCSkeletonKnight";
import { npcSlime } from "./NPCSlime";
import { npcWolf } from "./NPCWolf";

export const hostileNPCs = {
  orc: npcOrc,
  skeleton: npcSkeleton,
  rat: npcRat,
  skeletonKnight: npcSkeletonKnight,
  bat: npcBat,
  ghost: npcGhost,
  minotaur: npcMinotaur,
  slime: npcSlime,
  Wolf: npcWolf,
  ghoul: npcGhoul,
};
