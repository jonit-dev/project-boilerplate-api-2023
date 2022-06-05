import { CharacterView } from "@providers/character/CharacterView";
import { container } from "@providers/inversify/container";
import { ItemView } from "@providers/item/ItemView";
import { ItemSlotType, ItemSubType, ItemType, MapLayers, TypeHelper } from "@rpg-engine/shared";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";
import { ItemContainer } from "./ItemContainerModel";

const itemSchema = createSchema(
  {
    tiledId: Type.number(),
    owner: Type.objectId({
      ref: "Character",
    }),
    type: Type.string({
      required: true,
      default: ItemType.Other,
      enum: TypeHelper.enumToStringArray(ItemType),
    }),
    subType: Type.string({
      required: true,
      default: ItemSubType.Other,
      enum: TypeHelper.enumToStringArray(ItemSubType),
    }),
    name: Type.string({ required: true }),
    description: Type.string({ required: true }),
    key: Type.string({ required: true }),
    textureAtlas: Type.string({ required: true, default: "items" }),
    texturePath: Type.string({ required: true }),
    textureKey: Type.string({ required: true }),
    attack: Type.number(),
    defense: Type.number(),
    weight: Type.number({ required: true }),
    allowedEquipSlotType: Type.array().of(Type.string({ enum: TypeHelper.enumToStringArray(ItemSlotType) })),
    maxStackSize: Type.number({ required: true, default: 1 }),
    stackQty: Type.number(),
    isUsable: Type.boolean({ required: true, default: false }),
    usableEffect: Type.string(),
    isStorable: Type.boolean({ required: true, default: true }),
    x: Type.number(),
    y: Type.number(),
    scene: Type.string(),
    layer: Type.number({
      default: MapLayers.OverGround,
    }),
    isItemContainer: Type.boolean({
      default: false,
      required: true,
    }),
    itemContainer: Type.objectId({
      ref: "ItemContainer",
    }),
    isSolid: Type.boolean({ required: true, default: false }),
    ...({} as {
      isEquipable: boolean;
      isStackable: boolean;
      fullDescription: string;
    }),
    decayTime: Type.date(),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

itemSchema.virtual("isEquipable").get(function (this: IItem) {
  return this.allowedEquipSlotType && this.allowedEquipSlotType.length > 0;
});

itemSchema.virtual("isStackable").get(function (this: IItem) {
  return this.maxStackSize > 1;
});

itemSchema.virtual("fullDescription").get(function (this: IItem) {
  return `${
    this.attack && this.defense
      ? `Attack: ${this.attack}. Defense: ${this.defense}.` + (this.weight && `Weight: ${this.weight}.`)
      : this.description
  }`;
});

const warnAboutItemChanges = async (item: IItem, warnType: "changes" | "removal"): Promise<void> => {
  if (item.x && item.y && item.scene) {
    const characterView = container.get<CharacterView>(CharacterView);
    const itemView = container.get<ItemView>(ItemView);

    const nearbyCharacters = await characterView.getCharactersAroundXYPosition(item.x, item.y, item.scene);

    for (const character of nearbyCharacters) {
      if (warnType === "changes") {
        await itemView.warnCharacterAboutItemsInView(character);
      }

      if (warnType === "removal") {
        await itemView.warnCharacterAboutItemRemovalInView(item);
      }
    }
  }
};

itemSchema.post("updateOne", async function (this: IItem) {
  await warnAboutItemChanges(this, "changes");
});

itemSchema.post("save", async function (this: IItem) {
  if (this.isItemContainer) {
    const newContainer = new ItemContainer({
      parentItem: this._id,
    });
    await newContainer.save();
  }

  await warnAboutItemChanges(this, "changes");
});

itemSchema.post("remove", async function (this: IItem) {
  await warnAboutItemChanges(this, "removal");

  if (this.isItemContainer) {
    await ItemContainer.deleteOne({ parentItem: this._id });
  }
});

export type IItem = ExtractDoc<typeof itemSchema>;

export const Item = typedModel("Item", itemSchema);
