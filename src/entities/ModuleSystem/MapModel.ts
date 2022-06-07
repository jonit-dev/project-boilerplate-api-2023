import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

const MapSchema = createSchema(
  {
    name: Type.string({ required: true }),
    checksum: Type.string({ required: true }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IMap = ExtractDoc<typeof MapSchema>;

export const MapModel = typedModel("Map", MapSchema);
