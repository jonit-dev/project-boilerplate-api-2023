import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questInteractionCraftSword = {
  title: "Get a brand new sword",
  description: "Bring me these items and I will craft a brand new katana sword for you!",
  key: QuestsBlueprint.InteractionCraftSword,
  rewards: [
    {
      itemKeys: [SwordsBlueprint.Katana],
      qty: 1,
    },
  ],
  objectives: [
    {
      items: [
        { itemKey: CraftingResourcesBlueprint.IronIngot, qty: 1 },
        { itemKey: CraftingResourcesBlueprint.WoodenSticks, qty: 5 },
      ],
      type: QuestType.Interaction,
    },
  ],
} as Partial<IQuest>;
