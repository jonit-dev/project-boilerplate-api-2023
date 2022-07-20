import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { npcAgatha } from "./blueprints/friendly/NPCAgatha";
import { npcAlice } from "./blueprints/friendly/NPCAlice";
import { npcAnnie } from "./blueprints/friendly/NPCAnnie";
import { npcBlackKnight } from "./blueprints/friendly/NPCBlackKnight";
import { npcFatBaldMan } from "./blueprints/friendly/NPCFatBaldMan";
import { npcFelicia } from "./blueprints/friendly/NPCFelicia";
import { npcMaleNobleBlackHair } from "./blueprints/friendly/NPCMaleNobleBlackHair";
import { npcMaria } from "./blueprints/friendly/NPCMaria";
import { npcTrader } from "./blueprints/friendly/NPCTrader";
import { npcWomanBlueHair } from "./blueprints/friendly/NPCWomanBlueHair";
import { npcWomanGreenHair } from "./blueprints/friendly/NPCWomanGreenHair";
import { npcBat } from "./blueprints/hostile/NPCBat";
import { npcGhost } from "./blueprints/hostile/NPCGhost";
import { npcMinotaur } from "./blueprints/hostile/NPCMinotaur";
import { npcOrc } from "./blueprints/hostile/NPCOrc";
import { npcRat } from "./blueprints/hostile/NPCRat";
import { npcSkeleton } from "./blueprints/hostile/NPCSkeleton";
import { npcSkeletonKnight } from "./blueprints/hostile/NPCSkeletonKnight";
import { npcSlime } from "./blueprints/hostile/NPCSlime";
import { npcWolf } from "./blueprints/hostile/NPCWolf";
import { npcDeer } from "./blueprints/neutral/NPCDeer";

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
  "black-knight": npcBlackKnight,
  "woman-blue-hair": npcWomanBlueHair,
  trader: npcTrader,
  "fat-bald-man": npcFatBaldMan,
  "male-noble-black-hair": npcMaleNobleBlackHair,
  "woman-green-hair": npcWomanGreenHair,
};
