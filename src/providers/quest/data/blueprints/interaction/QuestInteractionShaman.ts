import { ShieldsBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questInteractionShaman = {
  title: "Find the Village Shaman and talk to him about the curse",
  description:
    "A small village on Rivenn Island is being plagued by strange and unsettling occurrences, from bizarre storms and frozen lakes, to the sudden disappearance of several villagers. As you investigate, you'll discover that the village is under the curse of an ancient and powerful entity, and must find a way to lift the curse and restore peace to the community.",
  key: QuestsBlueprint.InteractionShaman,
  rewards: [
    {
      itemKeys: [SwordsBlueprint.ShortSword],
      qty: 1,
    },
    {
      itemKeys: [ShieldsBlueprint.SilverShield],
      qty: 1,
    },
  ],
  objectives: [
    {
      targetNPCkey: FriendlyNPCsBlueprint.Shaman,
      type: QuestType.Interaction,
    },
  ],
} as Partial<IQuest>;
