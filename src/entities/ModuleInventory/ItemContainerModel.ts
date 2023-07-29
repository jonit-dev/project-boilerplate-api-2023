import {
  containerSlotsCaching,
  hashGenerator,
  inMemoryHashTable,
  itemCraftableCaching,
} from "@providers/inversify/container";
import { ItemType, TypeHelper } from "@rpg-engine/shared";
import { Types } from "mongoose";
import locks from "mongoose-locks";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ExtractDoc, Type, createSchema, typedModel } from "ts-mongoose";
import { IItem, Item } from "./ItemModel";

const itemContainerSchema = createSchema(
  {
    owner: Type.objectId({
      ref: "Character",
      index: true,
    }),
    isOwnerRestricted: Type.boolean(),
    parentItem: Type.objectId({
      ref: "Item",
      required: true,
    }),
    name: Type.string(),
    slotQty: Type.number({ required: true, default: 20 }),
    slots: Type.mixed({}),
    allowedItemTypes: Type.array().of(
      Type.string({
        enum: TypeHelper.enumToStringArray(ItemType),
      })
    ),
    ...({} as {
      totalItemsQty: number;
      isEmpty: boolean;
      itemIds: string[];
      items: Promise<IItem[]>;
      emptySlotsQty: number;
      firstAvailableSlot: IItem | null;
      firstAvailableSlotId: number | null;
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)
  .plugin(locks, { helpers: true, throw: true })
  .plugin(updateIfCurrentPlugin);

itemContainerSchema.index(
  {
    owner: 1,
    parentItem: 1,
  },
  { background: true }
);

itemContainerSchema.virtual("itemIds").get(function (this: IItemContainer) {
  if (!this.slots) {
    return [];
  }

  return Object.values(this.slots)
    .filter((x) => x !== null)
    .map((item: IItem) => item.id || item._id);
});

itemContainerSchema.virtual("items").get(function (this: IItemContainer) {
  if (!this.slots) {
    return [];
  }

  return Item.find({
    _id: { $in: this.itemIds.map((id) => Types.ObjectId(id)) },
  }).lean();
});

itemContainerSchema.virtual("totalItemsQty").get(function (this: IItemContainer) {
  if (!this.slots) {
    return 0;
  }

  return Object.values(this.slots).filter((x) => x !== null).length;
});

itemContainerSchema.virtual("firstAvailableSlotId").get(function (this: IItemContainer) {
  if (!this.slots) {
    return null;
  }

  for (let i = 0; i < this.slotQty; i++) {
    if (this.slots[i] === null) {
      return i;
    }
  }

  return null;
});

itemContainerSchema.virtual("firstAvailableSlot").get(function (this: IItemContainer) {
  if (!this.slots) {
    return null;
  }

  const slots = Object.values(this.slots);
  const emptySlots = slots.filter((x) => x === null) as IItem[];
  if (emptySlots.length === 0) {
    return null;
  }

  return emptySlots[0];
});

itemContainerSchema.virtual("emptySlotsQty").get(function (this: IItemContainer) {
  if (!this.slots) {
    return this.slotQty;
  }

  return Object.values(this.slots).filter((x) => x === null).length;
});

itemContainerSchema.virtual("isEmpty").get(function (this: IItemContainer) {
  return this.totalItemsQty === 0;
});

itemContainerSchema.pre("save", async function (this: IItemContainer) {
  if (!this.slots) {
    const slots = {};

    for (let i = 0; i < this.slotQty; i++) {
      slots[Number(i)] = null;
    }

    this.slots = slots;
  }

  await Item.updateOne(
    {
      _id: this.parentItem,
    },
    {
      $set: {
        isItemContainer: true,
        itemContainer: this._id,
      },
    }
  );
});

const onCheckSlotsChange = async function (itemContainer: IItemContainer): Promise<void> {
  if (!itemContainer.owner) {
    return;
  }

  const clearCache = async (): Promise<void> => {
    await inMemoryHashTable.delete("inventory-weight", itemContainer.owner!.toString()!);
    await inMemoryHashTable.delete("container-all-items", itemContainer._id.toString()!);

    await itemCraftableCaching.clearCraftbookCache(itemContainer.owner!.toString()!);
  };

  const slotsHash = await containerSlotsCaching.getSlotsHash(itemContainer._id.toString()!);

  if (!slotsHash) {
    await clearCache();

    await containerSlotsCaching.setSlotsHash(itemContainer._id.toString()!, itemContainer.slots);
    return;
  }

  // if there's a slot hash, compare

  const currentSlotsHash = hashGenerator.generateHash(itemContainer.slots);

  if (slotsHash !== currentSlotsHash) {
    await clearCache();

    await containerSlotsCaching.setSlotsHash(itemContainer._id.toString()!, itemContainer.slots);
  }
};

itemContainerSchema.post("save", async function (this: IItemContainer) {
  if (this.owner) {
    await inMemoryHashTable.delete("character-max-weights", this.owner.toString()!);
  }

  await onCheckSlotsChange(this as IItemContainer);
});

itemContainerSchema.post("remove", async function (this: IItemContainer) {
  await inMemoryHashTable.delete("container-all-items", this._id.toString()!);

  if (this.itemIds) {
    for (const itemId of this.itemIds) {
      const item = await Item.findById(itemId);

      if (item) {
        await item.remove();
      }
    }
  }
});

async function onItemContainerUpdate(doc, next): Promise<void> {
  // @ts-ignore
  const itemContainer = await this.model.findOne(this.getQuery());

  if (!itemContainer.owner) {
    return next();
  }

  await inMemoryHashTable.delete("character-weights", itemContainer.owner!.toString()!);
  await inMemoryHashTable.delete("character-max-weights", itemContainer.owner!.toString()!);

  await onCheckSlotsChange(itemContainer as IItemContainer);

  next();
}

itemContainerSchema.pre(/updateOne/, onItemContainerUpdate);
itemContainerSchema.pre(/updateMany/, onItemContainerUpdate);
itemContainerSchema.pre(/findOneAndUpdate/, onItemContainerUpdate);

export type IItemContainer = ExtractDoc<typeof itemContainerSchema>;

export const ItemContainer = typedModel("ItemContainer", itemContainerSchema);
