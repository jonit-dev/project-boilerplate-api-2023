import { ItemType, TypeHelper } from "@rpg-engine/shared";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";
import { IItem, Item } from "./ItemModel";

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
    items: Type.array().of(
      Type.objectId({
        ref: "Item",
      })
    ),
    allowedItemTypes: Type.array().of(
      Type.string({
        enum: TypeHelper.enumToStringArray(ItemType),
      })
    ),
    ...({} as {
      isEmpty: boolean;
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

itemContainerSchema.virtual("isEmpty").get(function (this: IItemContainer) {
  const items = this.items as unknown as IItem[];

  return !items || items.length === 0;
});

itemContainerSchema.post("remove", async function (this: IItemContainer) {
  if (this.items) {
    for (const itemId of this.items) {
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
