import { ItemType, TypeHelper } from "@rpg-engine/shared";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";
import { IItem, Item } from "./ItemModel";

const itemContainerSchema = createSchema(
  {
    owner: Type.objectId({
      ref: "Character",
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
      emptySlotsQty: number;
      firstAvailableSlot: IItem | null;
      firstAvailableSlotId: number | null;
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

itemContainerSchema.virtual("itemIds").get(function (this: IItemContainer) {
  if (!this.slots) {
    return [];
  }

  return Object.values(this.slots)
    .filter((x) => x !== null)
    .map((item: IItem) => item.id || item._id);
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

itemContainerSchema.post("save", async function (this: IItemContainer) {
  if (!this.slots) {
    const slots = {};

    for (let i = 0; i < 20; i++) {
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

itemContainerSchema.post("remove", async function (this: IItemContainer) {
  if (this.itemIds) {
    for (const itemId of this.itemIds) {
      const item = await Item.findById(itemId);

      if (item) {
        await item.remove();
      }
    }
  }
});

export type IItemContainer = ExtractDoc<typeof itemContainerSchema>;

export const ItemContainer = typedModel("ItemContainer", itemContainerSchema);
