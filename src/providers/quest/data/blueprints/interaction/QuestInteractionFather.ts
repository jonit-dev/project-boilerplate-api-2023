import { RangedBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questInteractionFather = {
  title: "Clear the rat infestation",
  description:
    "Help your father to clear the rat infestation in our village sewer, and receive a slingshot to help in your journey!",
  key: QuestsBlueprint.InteractionTrader,
  rewards: [
    {
      itemKeys: [RangedBlueprint.Slingshot],
      qty: 1,
    },
    {
      itemKeys: [RangedBlueprint.Stone],
      qty: 100,
    },
  ],
  objectives: [
    {
      targetNPCkey: FriendlyNPCsBlueprint.Father,
      type: QuestType.Interaction,
    },
  ],
} as Partial<IQuest>;
