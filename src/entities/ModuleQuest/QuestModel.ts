import { createLeanSchema } from "@providers/database/mongooseHelpers";
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
      objectivesDetails: IQuestObjectiveKill[] | IQuestObjectiveInteraction[];
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

  return killObj.concat(interactionObj);
});

export type IQuest = ExtractDoc<typeof questSchema>;

export const Quest = typedModel("Quest", questSchema);
