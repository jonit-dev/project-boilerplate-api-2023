import { AccessoriesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { IQuest, IQuestObjectiveKill, IQuestReward, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

const questKillOrcsReward: Partial<IQuestReward> = {
  itemKeys: [AccessoriesBlueprint.SilverKey],
  qty: 1,
};

const questKillOrcsObjective: Partial<IQuestObjectiveKill> = {
  killCountTarget: 5,
  creatureKeys: [HostileNPCsBlueprint.Orc],
  type: QuestType.Kill,
};

export const questKillOrcs = {
  title: "Kill orcs",
  description: "Orcs are besieging the village. Please, help us killing as many as you can.",
  key: QuestsBlueprint.KillOrcs,
  rewards: [questKillOrcsReward],
  objectives: [questKillOrcsObjective],
} as Partial<IQuest>;
