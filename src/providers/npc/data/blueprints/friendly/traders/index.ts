import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { npcBlacksmith } from "./NPCBlacksmith";
import { npcTrader } from "./NPCTrader";
import { npcTraderFood } from "./NPCTraderFood";
import { npcTraderMage } from "./NPCTraderMage";

export const npcTradersIndex = {
  [FriendlyNPCsBlueprint.Blacksmith]: npcBlacksmith,
  [FriendlyNPCsBlueprint.Trader]: npcTrader,
  [FriendlyNPCsBlueprint.TraderFood]: npcTraderFood,
  [FriendlyNPCsBlueprint.TraderMage]: npcTraderMage,
};
