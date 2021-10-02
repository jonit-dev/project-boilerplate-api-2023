import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

const abTestSchema = createSchema(
  {
    name: Type.string(),
    slug: Type.string(),
    description: Type.string(),
    enabled: Type.boolean({ default: true }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IABTest = ExtractDoc<typeof abTestSchema>;

export const ABTest = typedModel("ABTest", abTestSchema);
