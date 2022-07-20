import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { npcAgatha } from "./blueprints/friendly/NPCAgatha";
import { npcAlice } from "./blueprints/friendly/NPCAlice";
import { npcAnnie } from "./blueprints/friendly/NPCAnnie";
import { npcFatBaldMan } from "./blueprints/friendly/NPCFatBaldMan";
import { npcFelicia } from "./blueprints/friendly/NPCFelicia";
import { npcKnight1 } from "./blueprints/friendly/NPCKnight1";
import { npcMaleNobleBlackHair } from "./blueprints/friendly/NPCMaleNobleBlackHair";
import { npcMaria } from "./blueprints/friendly/NPCMaria";
import { npcTrader } from "./blueprints/friendly/NPCTrader";
import { npcWomanBlueHair } from "./blueprints/friendly/NPCWomanBlueHair";
import { npcWomanGreenHair } from "./blueprints/friendly/NPCWomanGreenHair";
import { npcBat } from "./blueprints/hostile/NPCBat";
import { npcOrc } from "./blueprints/hostile/NPCOrc";
import { npcRat } from "./blueprints/hostile/NPCRat";
import { npcSkeleton } from "./blueprints/hostile/NPCSkeleton";
import { npcSkeletonKnight } from "./blueprints/hostile/NPCSkeletonKnight";
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
  "knight-1": npcKnight1,
  "woman-blue-hair": npcWomanBlueHair,
  trader: npcTrader,
  "fat-bald-man": npcFatBaldMan,
  "male-noble-black-hair": npcMaleNobleBlackHair,
  "woman-green-hair": npcWomanGreenHair,
};
