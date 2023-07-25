import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { containerSlotsCaching, hashGenerator, inMemoryHashTable } from "@providers/inversify/container";
import { SpeedGooseCacheAutoCleaner } from "speedgoose";
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

equipmentSchema.index(
  {
    owner: 1,
    ownerRef: 1,
    inventory: 1,
  },
  { background: true }
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

equipmentSchema.plugin(SpeedGooseCacheAutoCleaner);

const clearEquipmentSlotCaching = async (ownerId: string): Promise<void> => {
  await inMemoryHashTable.delete("equipment-slots", ownerId.toString());
  await inMemoryHashTable.delete("character-shield", ownerId.toString());
};

const onCheckEquipmentChange = async function (equipment: IEquipment): Promise<void> {
  if (!equipment.owner) {
    return;
  }

  const slotsHash = await containerSlotsCaching.getSlotsHash(equipment._id.toString()!);

  if (!slotsHash) {
    await inMemoryHashTable.delete("equipment-weight", equipment.owner?.toString()!);

    await containerSlotsCaching.setSlotsHash(
      equipment._id.toString()!,
      equipment as unknown as Record<string, unknown>
    );
    return;
  }

  // if there's a slot hash, compare

  const currentSlotsHash = hashGenerator.generateHash(equipment);

  const doesHashesMatch = String(slotsHash) === String(currentSlotsHash);

  if (!doesHashesMatch) {
    await inMemoryHashTable.delete("equipment-weight", equipment.owner?.toString()!);

    await containerSlotsCaching.setSlotsHash(
      equipment._id.toString()!,
      equipment as unknown as Record<string, unknown>
    );
  }
};

equipmentSchema.post("save", async function (this: IEquipment) {
  if (this.owner) {
    await clearEquipmentSlotCaching(this.owner.toString());

    await onCheckEquipmentChange(this);
  }
});

async function onEquipmentUpdate(doc, next): Promise<void> {
  // @ts-ignore
  const equipment = await this.model.findOne(this.getQuery());

  if (!equipment.owner) {
    return next();
  }
  await clearEquipmentSlotCaching(equipment.owner.toString());
  await onCheckEquipmentChange(equipment);

  next();
}

equipmentSchema.pre(/updateOne/, onEquipmentUpdate);
equipmentSchema.pre(/updateMany/, onEquipmentUpdate);
equipmentSchema.pre(/findOneAndUpdate/, onEquipmentUpdate);

export type IEquipment = ExtractDoc<typeof equipmentSchema>;

export const Equipment = typedModel("Equipment", equipmentSchema);
