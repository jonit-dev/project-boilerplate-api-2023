import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { ItemContainerHelper } from "@providers/itemContainer/ItemContainerHelper";
import { IItemContainer, ItemType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

interface IUpdateQuery {
  $set?: Partial<IItem>;
  $unset?: { [field: string]: "" };
}

@provide(ItemUpdater)
export class ItemUpdater {
  constructor(private itemContainerHelper: ItemContainerHelper, private characterItemSlot: CharacterItemSlots) {}

  public async updateItemRecursivelyIfNeeded(item: IItem, updateQuery: IUpdateQuery): Promise<void> {
    if (item.type === ItemType.Container) {
      const itemContainer = (await ItemContainer.findById(item.itemContainer)) as unknown as IItemContainer;

      await this.itemContainerHelper.execFnInAllItemContainerSlots(itemContainer, async (item, slotIndex) => {
        // if its a container, update it recursively
        if (item.type === ItemType.Container) {
          await this.updateItemRecursivelyIfNeeded(item, updateQuery);
          return;
        }

        await Item.updateOne({ _id: item._id }, updateQuery);

        await this.characterItemSlot.updateItemOnSlot(slotIndex, itemContainer as any, updateQuery);
      });
      return;
    }

    // TODO: Update it on its slot too?

    // if its not a container, just update it normally
    await Item.updateOne({ _id: item._id }, updateQuery);
  }
}
