import { ToolsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questInteractionStoryTeller = {
  title: "Listen stories from Story Teller",
  description:
    "Our history is full of legendary stories. We cannot safely go to the future without knowing these. Let's hear some good stories from the story teller!",
  key: QuestsBlueprint.InteractionStoryTeller,
  rewards: [
    {
      itemKeys: [ToolsBlueprint.Pickaxe],
      qty: 1,
    },
  ],
  objectives: [
    {
      targetNPCkey: FriendlyNPCsBlueprint.StoryTeller,
      type: QuestType.Interaction,
    },
  ],
} as Partial<IQuest>;
