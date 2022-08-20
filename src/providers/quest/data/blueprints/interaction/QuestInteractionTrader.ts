import { AccessoriesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { IQuest, IQuestObjectiveInteraction, IQuestReward, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

const questInteractionTraderReward: Partial<IQuestReward> = {
  itemKeys: [AccessoriesBlueprint.SilverKey],
  qty: 1,
};

const questInteractionTraderObjective: Partial<IQuestObjectiveInteraction> = {
  targetNPCkey: FriendlyNPCsBlueprint.Trader,
  type: QuestType.Interaction,
};

export const questInteractionTrader = {
  title: "Deliver message to the trader",
  description:
    "Need to send a message to my brother, the trader, about my father's health. I cannot do it because it is too dangerous out there. Please, help me by delivering this message to him.",
  key: QuestsBlueprint.InteractionTrader,
  rewards: [questInteractionTraderReward],
  objectives: [questInteractionTraderObjective],
} as Partial<IQuest>;
