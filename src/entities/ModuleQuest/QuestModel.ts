import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { QuestStatus } from "@rpg-engine/shared";
import _ from "lodash";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";
import {
  IQuestObjectiveInteraction,
  IQuestObjectiveKill,
  QuestObjectiveInteraction,
  QuestObjectiveKill,
} from "./QuestObjectiveModel";

const questSchema = createLeanSchema(
  {
    npcId: Type.objectId({ ref: "NPC" }),
    title: Type.string({ required: true }),
    description: Type.string({ required: true }),
    rewards: Type.array().of(Type.objectId({ ref: "QuestReward" })),
    objectives: Type.array().of(Type.objectId()),
    ...({} as {
      objectivesDetails: Promise<IQuestObjectiveKill[] | IQuestObjectiveInteraction[]>;
      hasStatus(status: QuestStatus): Promise<boolean>;
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

questSchema.virtual("objectivesDetails").get(async function (this: IQuest) {
  const killObj = (await QuestObjectiveKill.find({
    _id: { $in: this.objectives },
  })) as any[];

  const interactionObj = (await QuestObjectiveInteraction.find({
    _id: { $in: this.objectives },
  })) as any[];

  if (_.isEmpty(killObj)) {
    return interactionObj || [];
  }

  if (_.isEmpty(interactionObj)) {
    return killObj || [];
  }

  return killObj.push(...interactionObj);
});

questSchema.methods.hasStatus = async function (this: IQuest, status: QuestStatus): Promise<boolean> {
  const objectives = await this.objectivesDetails;
  // Case pending && completed ==> All should be same state
  // Case in progress ==> With 1 in progress is inProgress state
  // Case in progress ==> With 1 completed and 1 pending, is also inProgress state
  let currentStatus = QuestStatus.Pending;
  for (let i = 0; i < objectives.length; i++) {
    const obj = objectives[i];
    if (i === 0) {
      currentStatus = obj.status as QuestStatus;
      continue;
    }

    if (obj.status === QuestStatus.InProgress) {
      currentStatus = obj.status;
      break;
    }

    if (
      (currentStatus === QuestStatus.Pending && obj.status === QuestStatus.Completed) ||
      (currentStatus === QuestStatus.Completed && obj.status === QuestStatus.Pending)
    ) {
      currentStatus = QuestStatus.InProgress;
      break;
    }
  }
  return currentStatus === status;
};

export type IQuest = ExtractDoc<typeof questSchema>;

export const Quest = typedModel("Quest", questSchema);
