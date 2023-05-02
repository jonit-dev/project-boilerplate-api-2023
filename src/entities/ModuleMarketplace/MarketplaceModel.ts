import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

const marketplaceSchema = createLeanSchema(
  {
    name: Type.string({
      required: true,
    }),
    open: Type.boolean({ default: true }),
    items: Type.array().of({
      key: Type.string({ required: true }),
      type: Type.string({ required: true }),
      subType: Type.string({ required: true }),
      texturePath: Type.string({ required: true }),
      name: Type.string({ required: true }),
      description: Type.string({ required: true }),
      weight: Type.number({ required: true }),
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IMarketplace = ExtractDoc<typeof marketplaceSchema>;

export const Marketplace = typedModel("Marketplace", marketplaceSchema);
