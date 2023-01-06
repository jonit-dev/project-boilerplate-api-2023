import { IQuest } from "@entities/ModuleQuest/QuestModel";
import { IQuestObjectiveKill } from "@entities/ModuleQuest/QuestObjectiveModel";
import { IQuestReward } from "@entities/ModuleQuest/QuestRewardModel";
import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint, HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { QuestsBlueprint } from "@providers/quest/data/questsBlueprintTypes";
import { IQuestObjectiveInteraction } from "@rpg-engine/shared";

export const questMock: Partial<IQuest> = {
  title: "Example quest",
  description: "This is the example quest used for tests",
  key: QuestsBlueprint.Example,
};

export const questRewardsMock: Partial<IQuestReward> = {
  itemKeys: [AccessoriesBlueprint.SilverKey],
  qty: 1,
};

export const questKillObjectiveMock: Partial<IQuestObjectiveKill> = {
  killCountTarget: 5,
  creatureKeys: [HostileNPCsBlueprint.Orc],
};

export const questInteractionObjectiveMock: Partial<IQuestObjectiveInteraction> = {
  targetNPCkey: FriendlyNPCsBlueprint.Alice,
};

export const questInteractionCraftObjectiveMock: Partial<IQuestObjectiveInteraction> = {
  // @ts-ignore
  itemsKeys: [CraftingResourcesBlueprint.Diamond, CraftingResourcesBlueprint.Silk],
};
