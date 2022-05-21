import { ItemSlotType, ItemType, MapLayers, TypeHelper } from "@rpg-engine/shared";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

const itemSchema = createSchema(
  {
    type: Type.string({
      required: true,
      default: ItemType.Other,
      enum: TypeHelper.enumToStringArray(ItemType),
    }),
    name: Type.string({ required: true }),
    description: Type.string({ required: true }),
    textureKey: Type.string({ required: true }),
    attack: Type.number(),
    defense: Type.number(),
    weight: Type.number({ required: true }),
    equipSlotType: Type.string({
      enum: TypeHelper.enumToStringArray(ItemSlotType),
    }),
    maxStackSize: Type.number(),
    isUsable: Type.boolean({ required: true, default: false }),
    usableEffect: Type.string(),
    isStorable: Type.boolean({ required: true, default: true }),
    x: Type.number(),
    y: Type.number(),
    scene: Type.string(),
    layer: Type.number({
      default: MapLayers.OverGround,
    }),
    itemContainer: Type.objectId({
      ref: "ItemContainer",
    }),
    ...({} as {
      isStackable: boolean;
      isItemContainer: boolean;
      fullDescription: string;
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

itemSchema.virtual("isEquipable").get(function (this: IItem) {
  return !!this.equipSlotType;
});

itemSchema.virtual("isStackable").get(function (this: IItem) {
  return !!this.maxStackSize;
});

itemSchema.virtual("isItemContainer").get(function (this: IItem) {
  return !!this.itemContainer;
});

itemSchema.virtual("fullDescription").get(function (this: IItem) {
  return `${
    this.attack &&
    this.defense &&
    `Attack: ${this.attack}. Defense: ${this.defense}.` + (this.weight && `Weight: ${this.weight}.`)
  }`;
});

export type IItem = ExtractDoc<typeof itemSchema>;

export const Item = typedModel("Item", itemSchema);
