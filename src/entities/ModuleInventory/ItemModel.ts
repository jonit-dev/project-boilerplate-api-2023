import { CharacterView } from "@providers/character/CharacterView";
import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { container } from "@providers/inversify/container";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemView } from "@providers/item/ItemView";
import { ItemSlotType, ItemSubType, ItemType, MapLayers, TypeHelper } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { UpdateQuery } from "mongoose";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";
import { ItemContainer } from "./ItemContainerModel";

const itemSchema = createLeanSchema(
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
    rangeType: Type.string({
      enum: TypeHelper.enumToStringArray(EntityAttackType),
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
    usableEffect: Type.mixed(),
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
    generateContainerSlots: Type.number(),
    isSolid: Type.boolean({ required: true, default: false }),
    ...({} as {
      isEquipable: boolean;
      isStackable: boolean;
      fullDescription: string;
      baseKey: string;
    }),
    decayTime: Type.date(),
    maxRange: Type.number(),
    requiredAmmoKeys: Type.array({ required: false }).of(
      Type.string({ enum: TypeHelper.enumToStringArray(RangedWeaponsBlueprint) })
    ),
    isTwoHanded: Type.boolean({ required: true, default: false }),
    hasUseWith: Type.boolean({ required: true, default: false }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

itemSchema.virtual("baseKey").get(function (this: IItem) {
  return this.key.replace(/-\d+$/, "");
});

itemSchema.virtual("isEquipable").get(function (this: IItem) {
  return this.allowedEquipSlotType && this.allowedEquipSlotType.length > 0;
});

itemSchema.virtual("isStackable").get(function (this: IItem) {
  return this.maxStackSize > 1;
});

itemSchema.virtual("fullDescription").get(function (this: IItem) {
  return `${
    this.name
  }: ${this.attack !== undefined && this.defense !== undefined ? `Attack: ${this.attack}. Defense: ${this.defense}.` + (this.weight && ` Weight: ${this.weight}.`) : this.description}`;
});

const warnAboutItemChanges = async (item: IItem, warnType: "changes" | "removal"): Promise<void> => {
  if (item.x !== undefined && item.y !== undefined && item.scene) {
    const characterView = container.get<CharacterView>(CharacterView);
    const itemView = container.get<ItemView>(ItemView);

    const nearbyCharacters = await characterView.getCharactersAroundXYPosition(item.x, item.y, item.scene);

    for (const character of nearbyCharacters) {
      if (warnType === "changes") {
        await itemView.warnCharacterAboutItemsInView(character);
      }

      if (warnType === "removal") {
        await itemView.warnCharactersAboutItemRemovalInView(item, item.x, item.y, item.scene);
      }
    }
  }
};

itemSchema.post("updateOne", async function (this: UpdateQuery<IItem>) {
  const updatedItem = { ...this, ...this._update.$set };
  await warnAboutItemChanges(updatedItem, "changes");
});

itemSchema.post("save", async function (this: IItem) {
  const hasItemContainer = await ItemContainer.exists({ parentItem: this._id });

  if (this.isItemContainer && !hasItemContainer) {
    let slotQty: number = 20;

    if (this.generateContainerSlots) {
      slotQty = this.generateContainerSlots;
    }

    // generate slots object
    const slots = {};

    for (let i = 0; i < slotQty; i++) {
      slots[Number(i)] = null;
    }

    const newContainer = new ItemContainer({
      name: this.name,
      parentItem: this._id,
      slotQty,
      slots,
      owner: this.owner,
      isOwnerRestricted: !!this.owner,
    });

    await newContainer.save();

    this.itemContainer = newContainer._id;
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
