import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questInteractionFather = {
  title: "Speak with your father",
  description:
    "Help your father to clear the rat infestation in our village sewer, and receive a slingshot to help in your journey!",
  key: QuestsBlueprint.InteractionTrader,
  rewards: [
    {
      itemKeys: [RangedWeaponsBlueprint.Slingshot],
      qty: 1,
    },
    {
      itemKeys: [RangedWeaponsBlueprint.Stone],
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
