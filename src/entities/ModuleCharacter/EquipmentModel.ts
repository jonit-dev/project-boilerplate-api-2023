import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

export const equipmentSetSchema = createSchema(
  {
    owner: Type.objectId({
      refPath: "ownerRef", // ownerRef can be a Character or NPC!
    }),
    ownerRef: Type.string({
      enum: ["Character", "NPC"],
    }),
    head: Type.number({
      required: false,
      default: 0,
    }),
    neck: Type.number({
      required: false,
      default: 0,
    }),
    leftHand: Type.number({
      required: false,
      default: 0,
    }),
    rightHand: Type.number({
      required: false,
      default: 0,
    }),
    ring: Type.number({
      required: false,
      default: 0,
    }),
    legs: Type.number({
      required: false,
      default: 0,
    }),
    boot: Type.number({
      required: false,
      default: 0,
    }),
    accessory: Type.number({
      required: false,
      default: 0,
    }),
    armor: Type.number({
      required: false,
      default: 0,
    }),
    inventory: Type.number({
      required: false,
      default: 1,
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IEquipementSet = ExtractDoc<typeof equipmentSetSchema>;

export const EquipementSet = typedModel("EquipementSet", equipmentSetSchema);
