import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { npcAgatha } from "./blueprints/NPCAgatha";
import { npcAlice } from "./blueprints/NPCAlice";
import { npcAnnie } from "./blueprints/NPCAnnie";
import { npcFelicia } from "./blueprints/NPCFelicia";
import { npcMaria } from "./blueprints/NPCMaria";
import { npcOrc } from "./blueprints/NPCOrc";
import { npcRat } from "./blueprints/NPCRat";
import { npcSkeleton } from "./blueprints/NPCSkeleton";
import { npcSkeletonKnight } from "./blueprints/NPCSkeletonKnight";
import { npcBat } from "./blueprints/NPCBat";
import { npcDeer } from "./blueprints/NPCDeer";
import { npcGhost } from "./blueprints/NPCGhost";
import { npcMinotaur } from "./blueprints/NPCMinotaur";
import { npcSlime } from "./blueprints/NPCSlime";
import { npcWolf } from "./blueprints/NPCWolf";

export const npcsBlueprintIndex: IBlueprint = {
  agatha: npcAgatha,
  alice: npcAlice,
  annie: npcAnnie,
  felicia: npcFelicia,
  maria: npcMaria,
  orc: npcOrc,
  skeleton: npcSkeleton,
  rat: npcRat,
  skeletonKnight: npcSkeletonKnight,
  bat: npcBat,
  deer: npcDeer,
  ghost: npcGhost,
  minotaur: npcMinotaur,
  slime: npcSlime,
  Wolf: npcWolf,
};
