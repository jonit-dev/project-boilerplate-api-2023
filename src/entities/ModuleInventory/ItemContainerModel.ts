import { ItemType, TypeHelper } from "@rpg-engine/shared";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";
import { IItem } from "./ItemModel";

const itemContainerSchema = createSchema(
  {
    owner: Type.objectId({
      ref: "Character",
    }),
    name: Type.string(),
    slotQty: Type.number({ required: true }),
    items: Type.array({
      items: Type.objectId({
        ref: "Item",
      }),
    }),
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

export type IItemContainer = ExtractDoc<typeof itemContainerSchema>;

export const ItemContainer = typedModel("ItemContainer", itemContainerSchema);
