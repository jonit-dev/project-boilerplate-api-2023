import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

const depotSchema = createLeanSchema(
  {
    owner: Type.objectId({ ref: "Character", required: true }),
    itemContainer: Type.objectId({ ref: "ItemContainer" }),
    key: Type.string({ required: true }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IDepot = ExtractDoc<typeof depotSchema>;

export const Depot = typedModel("Depot", depotSchema);

depotSchema.index(
  {
    owner: 1,
    key: 1,
  },
  { background: true }
);
