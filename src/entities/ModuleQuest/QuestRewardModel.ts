import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

const questRewardSchema = createLeanSchema(
  {
    itemKeys: Type.array().of(Type.string()),
    spellKeys: Type.array().of(Type.string()),
    qty: Type.number({ required: true }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IQuestReward = ExtractDoc<typeof questRewardSchema>;

export const QuestReward = typedModel("QuestReward", questRewardSchema);
