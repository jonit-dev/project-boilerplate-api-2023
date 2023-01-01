import { ToolsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questInteractionCarpenter = {
  title: "Find the carpenter and learn how to make sleds from him",
  description:
    "The sled is the most meaningful toy of the winter months for children. You must find the carpenter and learn from him how to craft a sled for Christmas",
  key: QuestsBlueprint.InteractionCarpenter,
  rewards: [
    {
      itemKeys: [ToolsBlueprint.CarpentersAxe],
      qty: 1,
    },
  ],
  objectives: [
    {
      targetNPCkey: FriendlyNPCsBlueprint.Carpenter,
      type: QuestType.Interaction,
    },
  ],
} as Partial<IQuest>;
