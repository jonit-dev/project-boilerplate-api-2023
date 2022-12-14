import { FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { NeutralNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questKillDeers = {
  title: "Kill 5 Deers",
  description:
    "Forests have dangerous creatures and also delicious food. Hunt 5 deers for survival and get your reward!",
  key: QuestsBlueprint.KillDeers,
  rewards: [
    {
      itemKeys: [FoodsBlueprint.RedMeat],
      qty: 2,
    },
    {
      itemKeys: [FoodsBlueprint.RawBeefSteak],
      qty: 1,
    },
  ],
  objectives: [
    {
      killCountTarget: 5,
      creatureKeys: [NeutralNPCsBlueprint.Deer],
      type: QuestType.Kill,
    },
  ],
} as Partial<IQuest>;
