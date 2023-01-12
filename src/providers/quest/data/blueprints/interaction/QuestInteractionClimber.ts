import { HelmetsBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questInteractionClimber = {
  title: "Find the Climber and Check His Directions",
  description:
    "A group of explorers has gone missing on Rivenn Island, and it's up to you to track them down and bring them home safely. As you search for clues and brave the dangers of the frozen wilderness, you'll uncover a sinister plot to exploit the island's resources, and must use your wits and skills to stop the perpetrators and save the day.",
  key: QuestsBlueprint.InteractionClimber,
  rewards: [
    {
      itemKeys: [SwordsBlueprint.DoubleEdgedSword],
      qty: 1,
    },
    {
      itemKeys: [HelmetsBlueprint.RedHoodie],
      qty: 1,
    },
  ],
  objectives: [
    {
      targetNPCkey: FriendlyNPCsBlueprint.Climber,
      type: QuestType.Interaction,
    },
  ],
} as Partial<IQuest>;
