import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

export const equipmentSetSchema = createSchema(
  {
    owner: Type.objectId({
      refPath: "ownerRef", // ownerRef can be a Character or NPC!
    }),
    ownerRef: Type.string({
      enum: ["Character", "NPC"],
    }),
    head: Type.objectId({
      required: false,
      ref: "Item",
    }),
    neck: Type.objectId({
      required: false,
      ref: "Item",
    }),
    leftHand: Type.objectId({
      required: false,
      ref: "Item",
    }),
    rightHand: Type.objectId({
      required: false,
      ref: "Item",
    }),
    ring: Type.objectId({
      required: false,
      ref: "Item",
    }),
    legs: Type.objectId({
      required: false,
      ref: "Item",
    }),
    boot: Type.objectId({
      required: false,
      ref: "Item",
    }),
    accessory: Type.objectId({
      required: false,
      ref: "Item",
    }),
    armor: Type.objectId({
      required: false,
      ref: "Item",
    }),
    inventory: Type.objectId({
      required: false,
      ref: "Item",
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

equipmentSetSchema.virtual("totalEquippedAttack").get(function (this: IEquipementSet) {
  let items;
  items = this.populate("head");
  items = this.populate("neck");
  items = this.populate("leftHand");
  items = this.populate("rightHand");
  items = this.populate("ring");
  items = this.populate("legs");
  items = this.populate("boot");
  items = this.populate("accessory");
  items = this.populate("inventory");

  return (
    items.head.attack +
    items.neck.attack +
    items.leftHand.attack +
    items.rightHand.attack +
    items.ring.attack +
    items.legs.attack +
    items.boot.attack +
    items.accessory.attack +
    items.inventory.attack
  );
});

equipmentSetSchema.virtual("totalEquippedDefense").get(function (this: IEquipementSet) {
  let items;
  items = this.populate("head");
  items = this.populate("neck");
  items = this.populate("leftHand");
  items = this.populate("rightHand");
  items = this.populate("ring");
  items = this.populate("legs");
  items = this.populate("boot");
  items = this.populate("accessory");
  items = this.populate("inventory");

  return (
    items.head.defense +
    items.neck.defense +
    items.leftHand.defense +
    items.rightHand.defense +
    items.ring.defense +
    items.legs.defense +
    items.boot.defense +
    items.accessory.defense +
    items.inventory.defense
  );
});

export type IEquipementSet = ExtractDoc<typeof equipmentSetSchema>;

export const EquipementSet = typedModel("EquipementSet", equipmentSetSchema);
