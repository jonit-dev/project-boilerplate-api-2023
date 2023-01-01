import { ToolsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questInteractionFisherman = {
  title: "Get advice from our skilled fisherman",
  description:
    "Fishing is a very important part of our land. You should get some advice for the best fishing techniques!",
  key: QuestsBlueprint.InteractionFisherman,
  rewards: [
    {
      itemKeys: [ToolsBlueprint.FishingRod],
      qty: 1,
    },
  ],
  objectives: [
    {
      targetNPCkey: FriendlyNPCsBlueprint.Fisherman,
      type: QuestType.Interaction,
    },
  ],
} as Partial<IQuest>;
