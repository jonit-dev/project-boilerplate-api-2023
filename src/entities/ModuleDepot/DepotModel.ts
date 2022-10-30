import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

const depotSchema = createLeanSchema(
  {
    owner: Type.objectId({ ref: "Character", required: true }),
    npc: Type.objectId({ ref: "NPC", required: true }),
    itemContainer: Type.objectId({ ref: "ItemContainer", required: true }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IDepot = ExtractDoc<typeof depotSchema>;

export const Depot = typedModel("Depot", depotSchema);
