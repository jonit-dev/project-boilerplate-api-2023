import { IQuest } from "@entities/ModuleQuest/QuestModel";
import { IQuestObjectiveKill } from "@entities/ModuleQuest/QuestObjectiveModel";
import { IQuestReward } from "@entities/ModuleQuest/QuestRewardModel";
import { AccessoriesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint, HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { IQuestObjectiveInteraction } from "@rpg-engine/shared";

export const questMock: Partial<IQuest> = {
  title: "Example quest",
  description: "This is the example quest used for tests",
};

export const questRewardsMock: Partial<IQuestReward> = {
  itemKeys: [AccessoriesBlueprint.SilverKey],
  qty: 1,
};

export const questKillObjectiveMock: Partial<IQuestObjectiveKill> = {
  killCount: 0,
  killCountTarget: 5,
  creatureKeys: [HostileNPCsBlueprint.Orc],
};

export const questInteractionObjectiveMock: Partial<IQuestObjectiveInteraction> = {
  targetNPCkey: FriendlyNPCsBlueprint.Alice,
};
