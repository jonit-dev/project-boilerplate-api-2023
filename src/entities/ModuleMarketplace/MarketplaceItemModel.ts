import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

const marketplaceItemSchema = createLeanSchema(
  {
    price: Type.number({ required: true }),
    item: Type.objectId({ ref: "Item" }),
    owner: Type.objectId({ ref: "Character" }),
    isBeingBought: Type.boolean({ default: false }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IMarketplaceItem = ExtractDoc<typeof marketplaceItemSchema>;

export const MarketplaceItem = typedModel("MarketplaceItem", marketplaceItemSchema);
