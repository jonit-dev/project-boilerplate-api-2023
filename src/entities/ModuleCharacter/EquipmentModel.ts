import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";
export const equipmentSchema = createLeanSchema(
  {
    owner: Type.objectId({
      refPath: "ownerRef", // ownerRef can be a Character or NPC!
      index: true,
    }),
    ownerRef: Type.string({
      enum: ["Character", "NPC"],
    }),
    head: Type.objectId({
      ref: "Item",
    }),
    neck: Type.objectId({
      ref: "Item",
    }),
    leftHand: Type.objectId({
      ref: "Item",
    }),
    rightHand: Type.objectId({
      ref: "Item",
    }),
    ring: Type.objectId({
      ref: "Item",
    }),
    legs: Type.objectId({
      ref: "Item",
    }),
    boot: Type.objectId({
      ref: "Item",
    }),
    accessory: Type.objectId({
      ref: "Item",
    }),
    armor: Type.objectId({
      ref: "Item",
    }),
    inventory: Type.objectId({
      ref: "Item",
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IEquipment = ExtractDoc<typeof equipmentSchema>;

export const Equipment = typedModel("Equipment", equipmentSchema);
