import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

const logSchema = createSchema(
  {
    action: Type.string(),
    emitter: Type.string(),
    target: Type.string(),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type ILog = ExtractDoc<typeof logSchema>;

export const Log = typedModel("Log", logSchema);
