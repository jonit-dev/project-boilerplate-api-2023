import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

const questRecordSchema = createLeanSchema(
  {
    quest: Type.objectId({ required: true, ref: "Quest" }),
    character: Type.objectId({ required: true, ref: "Character" }),
    objective: Type.objectId({ required: true }),
    status: Type.string({ required: true }),
    killCount: Type.number({ default: 0 }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IQuestRecord = ExtractDoc<typeof questRecordSchema>;

export const QuestRecord = typedModel("QuestRecord", questRecordSchema);
