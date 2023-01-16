import { DaggersBlueprint, HelmetsBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questKillPolarBears = {
  title: "Kill 4 Polar Bears",
  description:
    "A remote village on Rivenn Island is facing a strange and eerie situation, mysterious storms, frozen lakes, and the disappearance of several inhabitants. As you investigate, you will discover that the village is under the curse of a fierce and ancient polar bear. To lift the curse and bring peace back to the community, you must uncover the truth behind the bear's wrath and put a stop to it. The journey will be dangerous and difficult, but with your determination and courage, you may be able to break the curse and save the village from certain doom.",
  key: QuestsBlueprint.KillPolarBears,
  rewards: [
    {
      itemKeys: [SwordsBlueprint.IceSword],
      qty: 1,
    },
    {
      itemKeys: [HelmetsBlueprint.DeathsHelmet],
      qty: 1,
    },
    {
      itemKeys: [DaggersBlueprint.SaiDagger],
      qty: 1,
    },
  ],
  objectives: [
    {
      killCountTarget: 4,
      creatureKeys: [HostileNPCsBlueprint.PolarBear],
      type: QuestType.Kill,
    },
  ],
} as Partial<IQuest>;
