import { FriendlyNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { npcAgatha } from "./NPCAgatha";
import { npcAlice } from "./NPCAlice";
import { npcAnnie } from "./NPCAnnie";
import { npcBlackKnight } from "./NPCBlackKnight";
import { npcFatBaldMan } from "./NPCFatBaldMan";
import { npcFather } from "./NPCFather";
import { npcFelicia } from "./NPCFelicia";
import { npcMaleNobleBlackHair } from "./NPCMaleNobleBlackHair";
import { npcMaria } from "./NPCMaria";
import { npcMother } from "./NPCMother";
import { npcSeniorKnight } from "./NPCSeniorKnight1";
import { npcTrader } from "./NPCTrader";
import { npcWomanBlueHair } from "./NPCWomanBlueHair";
import { npcWomanGreenHair } from "./NPCWomanGreenHair";

export const friendlyNPCs = {
  [FriendlyNPCsBlueprint.Agatha]: npcAgatha,
  [FriendlyNPCsBlueprint.Alice]: npcAlice,
  [FriendlyNPCsBlueprint.Annie]: npcAnnie,
  [FriendlyNPCsBlueprint.Felicia]: npcFelicia,
  [FriendlyNPCsBlueprint.Maria]: npcMaria,
  [FriendlyNPCsBlueprint.BlackKnight]: npcBlackKnight,
  [FriendlyNPCsBlueprint.WomanBlueHair]: npcWomanBlueHair,
  [FriendlyNPCsBlueprint.Trader]: npcTrader,
  [FriendlyNPCsBlueprint.FatBaldMan]: npcFatBaldMan,
  [FriendlyNPCsBlueprint.MaleNobleBlackHair]: npcMaleNobleBlackHair,
  [FriendlyNPCsBlueprint.WomanGreenHair]: npcWomanGreenHair,
  [FriendlyNPCsBlueprint.SeniorKnight1]: npcSeniorKnight,
  [FriendlyNPCsBlueprint.Father]: npcFather,
  [FriendlyNPCsBlueprint.Mother]: npcMother,
};
