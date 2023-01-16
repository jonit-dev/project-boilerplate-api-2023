import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questInteractionCraftSword = {
  title: "Get a brand new sword",
  description: "Bring me 5 iron ingot and 2 wooden sticks and I will craft a brand new katana sword for you!",
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
        { itemKey: CraftingResourcesBlueprint.IronIngot, qty: 5 },
        { itemKey: CraftingResourcesBlueprint.WoodenSticks, qty: 2 },
      ],
      type: QuestType.Interaction,
    },
  ],
} as Partial<IQuest>;
