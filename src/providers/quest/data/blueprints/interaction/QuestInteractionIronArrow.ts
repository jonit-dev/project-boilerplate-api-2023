import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questInteractionCraftIronArrow = {
  key: QuestsBlueprint.InteractionsCraftIronArrow,
  title: "John's Offer",
  description:
    "Greetings, adventurer! I am John, a seasoned trader who has traversed these lands for many years. I am in need of iron ore and wood sticks to craft a new batch of iron arrows for my hunting endeavors. If you can bring me 10 of each, I will reward you with a quiver of my finest iron arrows. Will you accept this quest and retrieve the materials for me?",
  rewards: [
    {
      itemKeys: [RangedWeaponsBlueprint.IronArrow],
      qty: 10,
    },
  ],
  objectives: [
    {
      // @ts-ignore
      itemsKeys: [CraftingResourcesBlueprint.IronIngot, CraftingResourcesBlueprint.WoodenSticks],
      type: QuestType.Interaction,
      // Should we Accept qty? Like 10?
    },
  ],
} as Partial<IQuest>;
