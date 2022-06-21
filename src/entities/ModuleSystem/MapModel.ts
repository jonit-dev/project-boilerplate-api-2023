import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

const MapSchema = createLeanSchema(
  {
    name: Type.string({ required: true }),
    checksum: Type.string({ required: true }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IMap = ExtractDoc<typeof MapSchema>;

export const MapModel = typedModel("Map", MapSchema);
