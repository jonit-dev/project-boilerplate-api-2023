import { ItemType, TypeHelper } from "@rpg-engine/shared";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";
import { Item } from "./ItemModel";

const itemContainerSchema = createSchema(
  {
    owner: Type.objectId({
      ref: "Character",
    }),
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
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

itemContainerSchema.virtual("itemIds").get(function (this: IItemContainer) {
  if (!this.slots) {
    return [];
  }

  return Object.values(this.slots);
});

itemContainerSchema.virtual("totalItemsQty").get(function (this: IItemContainer) {
  if (!this.slots) {
    return 0;
  }

  return Object.values(this.slots).length;
});

itemContainerSchema.virtual("isEmpty").get(function (this: IItemContainer) {
  const items = this.totalItemsQty;
  return !items;
});

itemContainerSchema.post("save", async function (this: IItemContainer) {
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
      } else {
        throw new Error(`Item Container error: Failed to remove ${itemId} after container destruction.`);
      }
    }
  }
});

export type IItemContainer = ExtractDoc<typeof itemContainerSchema>;

export const ItemContainer = typedModel("ItemContainer", itemContainerSchema);
