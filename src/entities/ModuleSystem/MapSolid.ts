import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

const mapSolidSchema = createSchema(
  {
    map: Type.string({ required: true }),
    layer: Type.number({
      required: true,
    }),
    gridX: Type.number({ required: true }),
    gridY: Type.number({ required: true }),
    isSolidThisLayerAndBelow: Type.boolean({ required: true }),
    isSolidOnlyThisLayer: Type.boolean({ required: true }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IMapSolid = ExtractDoc<typeof mapSolidSchema>;

export const MapSolid = typedModel("MapSolid", mapSolidSchema);
