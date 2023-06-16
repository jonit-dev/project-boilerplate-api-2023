import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

const marketplaceMoneySchema = createLeanSchema(
  {
    money: Type.number({ required: true }),
    owner: Type.objectId({ ref: "Character" }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IMarketplaceMoney = ExtractDoc<typeof marketplaceMoneySchema>;

export const MarketplaceMoney = typedModel("MarketplaceMoney", marketplaceMoneySchema);
