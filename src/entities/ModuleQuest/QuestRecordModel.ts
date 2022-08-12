import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

const questRecordSchema = createLeanSchema(
  {
    character: Type.objectId({ ref: "Character" }),
    objective: Type.objectId({ required: true }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IQuestRecord = ExtractDoc<typeof questRecordSchema>;

export const QuestRecord = typedModel("QuestRecord", questRecordSchema);
