import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { npcBlacksmith } from "./NPCBlacksmith";
import { npcTrader } from "./NPCTrader";
import { npcTraderAlchemist } from "./NPCTraderAlchemist";
import { npcTraderArcher } from "./NPCTraderArcher";
import { npcTraderFood } from "./NPCTraderFood";
import { npcTraderMage } from "./NPCTraderMage";

export const tradersNPCs = {
  [FriendlyNPCsBlueprint.Blacksmith]: npcBlacksmith,
  [FriendlyNPCsBlueprint.Trader]: npcTrader,
  [FriendlyNPCsBlueprint.TraderFood]: npcTraderFood,
  [FriendlyNPCsBlueprint.TraderMage]: npcTraderMage,
  [FriendlyNPCsBlueprint.TraderArcher]: npcTraderArcher,
  [FriendlyNPCsBlueprint.TraderAlchemist]: npcTraderAlchemist,
};
