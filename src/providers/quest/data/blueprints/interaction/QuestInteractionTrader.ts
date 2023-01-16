import { LegsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questInteractionTrader = {
  title: "Deliver message to the trader",
  description:
    "Need to send a message to my brother, the trader, about my father's health. Please, help me by delivering this message to him.",
  key: QuestsBlueprint.InteractionTrader,
  rewards: [
    {
      itemKeys: [LegsBlueprint.LeatherLegs],
      qty: 1,
    },
  ],
  objectives: [
    {
      targetNPCkey: FriendlyNPCsBlueprint.Trader,
      type: QuestType.Interaction,
    },
  ],
} as Partial<IQuest>;
