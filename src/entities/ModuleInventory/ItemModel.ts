import { CharacterView } from "@providers/character/CharacterView";
import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { container } from "@providers/inversify/container";
import { ItemView } from "@providers/item/ItemView";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { MapHelper } from "@providers/map/MapHelper";
import { ItemRarities, ItemSlotType, ItemSubType, ItemType, MapLayers, TypeHelper } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { UpdateQuery } from "mongoose";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";
import { ItemContainer } from "./ItemContainerModel";

import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const itemSchema = createLeanSchema(
  {
    tiledId: Type.number(),
    owner: Type.objectId({
      ref: "Character",
      index: true,
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
    entityType: Type.string({
      required: false,
    }),
    rarity: Type.string({
      default: ItemRarities.Common,
      enum: TypeHelper.enumToStringArray(ItemRarities),
    }),
    name: Type.string({ required: true }),
    description: Type.string({ required: true }),
    key: Type.string({ required: true, index: true }),
    textureAtlas: Type.string({ required: true, default: "items" }),
    texturePath: Type.string({ required: true }),
    attack: Type.number(),
    defense: Type.number(),
    weight: Type.number({ required: true }),
    allowedEquipSlotType: Type.array().of(Type.string({ enum: TypeHelper.enumToStringArray(ItemSlotType) })),
    maxStackSize: Type.number({ required: true, default: 1 }),
    stackQty: Type.number(),
    isUsable: Type.boolean({ required: true, default: false }),
    usableEffect: Type.mixed(),
    isStorable: Type.boolean({ required: true, default: true }),
    minRequirements: Type.object({ required: false }).of({
      level: Type.string,
      skill: {
        name: Type.string,
        level: Type.number,
      },
    }),
    x: Type.number(),
    y: Type.number(),
    scene: Type.string(),
    layer: Type.number({
      default: MapLayers.Decoration + 0.5,
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
    basePrice: Type.number(),
    canSell: Type.boolean({ required: true, default: true }),

    hasButchered: Type.boolean(),
    bodyFromId: Type.string(),

    canUseOnNonPVPZone: Type.boolean({ required: true, default: false }),

    isBeingPickedUp: Type.boolean({ required: true, default: false }), // lock mechanism to avoid item duplication

    isBeingEquipped: Type.boolean({ required: true, default: false }), // lock mechanism to avoid item equip duplication

    isEquipped: Type.boolean({ required: true, default: false }),

    isTraining: Type.boolean({ required: true, default: false }), // For training items which gives a max damage of 1

    isDeadBodyLootable: Type.boolean({ required: false }),

    usableEffectDescription: Type.string({ required: false }),

    equippedBuffDescription: Type.string({ required: false }),

    droppedBy: Type.objectId({
      ref: "Character",
    }),

    entityEffects: Type.array().of(
      Type.string({
        typeof: EntityEffectBlueprint,
      })
    ),

    entityEffectChance: Type.number({ default: 0 }),

    tier: Type.number({ default: 1 }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
).plugin(updateIfCurrentPlugin);

itemSchema.virtual("baseKey").get(function (this: IItem) {
  return this.key.replace(/-\d+$/, "");
});

itemSchema.virtual("isEquipable").get(function (this: IItem) {
  return this.allowedEquipSlotType && this.allowedEquipSlotType.length > 0;
});

itemSchema.virtual("fullDescription").get(function (this: IItem): string {
  let message: string = "";
  message = `${this.name}: ${this.description}`;
  if (this.attack) {
    message += ` Attack: ${this.attack}.`;
  }
  if (this.defense) {
    message += ` Defense: ${this.defense}.`;
  }
  if (this.weight) {
    message += ` Weight: ${this.weight}.`;
  }
  if (this.rarity) {
    message += ` Rarity: ${this.rarity}.`;
  }
  return message;
});

const warnAboutItemChanges = async (item: IItem, warnType: "changes" | "removal"): Promise<void> => {
  const mapHelper = container.get<MapHelper>(MapHelper);

  const hasCoordinates = item.x && item.y && item.scene;

  if (hasCoordinates && mapHelper.isCoordinateValid(item.x) && mapHelper.isCoordinateValid(item.y)) {
    const characterView = container.get<CharacterView>(CharacterView);
    const itemView = container.get<ItemView>(ItemView);

    const nearbyCharacters = await characterView.getCharactersAroundXYPosition(item.x!, item.y!, item.scene!);

    for (const character of nearbyCharacters) {
      if (warnType === "changes") {
        await itemView.warnCharacterAboutItemsInView(character);
      }

      if (warnType === "removal") {
        await itemView.warnCharactersAboutItemRemovalInView(item, item.x!, item.y!, item.scene!);
      }
    }
  }
};

itemSchema.post("updateOne", async function (this: UpdateQuery<IItem>) {
  const { _id } = this._conditions;
  if (!_id) return;

  const updatedItem = (await Item.findById(_id)) as IItem | undefined;
  if (updatedItem) await warnAboutItemChanges(updatedItem, "changes");
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

itemSchema.pre("remove", async function (next) {
  const item = this as IItem;

  if (!item.owner) {
    next();
    return;
  }

  const character = (await Character.findById(item.owner).lean()) as ICharacter;

  if (!character.equipment) {
    return;
  }

  const equipment = await Equipment.findById(character.equipment);

  const isEquipped = await equipment?.isEquipped(item._id);

  if (isEquipped) {
    next(new Error("Cannot delete item because it is equipped"));
  } else {
    next();
  }
});

itemSchema.pre("deleteOne", { document: false, query: true }, async function (next) {
  // The `this` here is a Query
  // @ts-ignore
  const skipEquipmentCheck: boolean = this.getOptions().skipEquipmentCheck;

  if (!skipEquipmentCheck) {
    // @ts-ignore
    const item = await this.model.findOne(this.getQuery());

    if (!item.owner) {
      next();
      return;
    }

    const character = (await Character.findById(item.owner).lean()) as ICharacter;

    if (!character.equipment) {
      return;
    }

    const equipment = await Equipment.findById(character.equipment);

    const isEquipped = equipment?.isEquipped(item._id);

    if (isEquipped) {
      next(new Error("Cannot delete item because it is equipped"));
      return;
    }
  }

  next();
});

export type IItem = ExtractDoc<typeof itemSchema>;

export const Item = typedModel("Item", itemSchema);
