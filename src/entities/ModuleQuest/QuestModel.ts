import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { QuestStatus } from "@rpg-engine/shared";
import { Types } from "mongoose";
import _ from "lodash";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";
import {
  IQuestObjectiveInteraction,
  IQuestObjectiveKill,
  QuestObjectiveInteraction,
  QuestObjectiveKill,
} from "./QuestObjectiveModel";
import { QuestRecord } from "./QuestRecordModel";

const questSchema = createLeanSchema(
  {
    npcId: Type.objectId({ ref: "NPC" }),
    title: Type.string({ required: true }),
    key: Type.string({ required: true }),
    description: Type.string({ required: true }),
    rewards: Type.array().of(Type.objectId({ ref: "QuestReward" })),
    objectives: Type.array().of(Type.objectId()),
    canBeRepeated: Type.boolean({ required: true, default: false }),
    ...({} as {
      objectivesDetails: Promise<IQuestObjectiveKill[] | IQuestObjectiveInteraction[]>;
      hasStatus(status: QuestStatus, characterId: string): Promise<boolean>;
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

questSchema.methods.hasStatus = async function (
  this: IQuest,
  status: QuestStatus,
  characterId: string
): Promise<boolean> {
  const objectives = await this.objectivesDetails;
  if (!objectives.length) {
    throw new Error(`Quest with id ${this.id} does not have objectives`);
  }
  const recordData =
    (await QuestRecord.find({
      character: Types.ObjectId(characterId),
      quest: this._id,
    })) || [];
  // Case pending && completed ==> All should be same state
  // Case in progress ==> With 1 in progress is inProgress state
  // Case in progress ==> With 1 completed and 1 pending, is also inProgress state
  let currentStatus = QuestStatus.Pending;
  for (let i = 0; i < recordData.length; i++) {
    const obj = recordData[i];
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

  // reapeatable quests can be done again if are completed
  if (currentStatus === QuestStatus.Completed && status === QuestStatus.Pending && this.canBeRepeated) {
    return true;
  }

  return currentStatus === status;
};

export type IQuest = ExtractDoc<typeof questSchema>;

export const Quest = typedModel("Quest", questSchema);
