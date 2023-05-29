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
    ...({} as {
      equippedItemIds: string;
      isEquipped(itemId: string): boolean;
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

equipmentSchema.virtual("equippedItemIds").get(function (this: IEquipment) {
  return [
    this.head,
    this.neck,
    this.leftHand,
    this.rightHand,
    this.ring,
    this.legs,
    this.boot,
    this.accessory,
    this.armor,
    this.inventory,
  ].filter((id) => id !== null);
});

equipmentSchema.method("isEquipped", function (this: IEquipment, itemId: string) {
  const equippedItems = [
    this.head,
    this.neck,
    this.leftHand,
    this.rightHand,
    this.ring,
    this.legs,
    this.boot,
    this.accessory,
    this.armor,
    this.inventory,
  ].map((id) => id?.toString());

  return equippedItems.includes(itemId.toString());
});

export type IEquipment = ExtractDoc<typeof equipmentSchema>;

export const Equipment = typedModel("Equipment", equipmentSchema);
