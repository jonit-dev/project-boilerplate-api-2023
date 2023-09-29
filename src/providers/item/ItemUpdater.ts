import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
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

  @TrackNewRelicTransaction()
  public async updateItemRecursivelyIfNeeded(item: IItem, updateQuery: IUpdateQuery): Promise<void> {
    if (item.type === ItemType.Container) {
      // first, update the item itself
      await Item.updateOne({ _id: item._id }, updateQuery);

      const itemContainer = (await ItemContainer.findById(item.itemContainer)) as unknown as IItemContainer;

      const processedItems = new Set<string>();

      await this.itemContainerHelper.execFnInAllItemContainerSlots(itemContainer, async (item, slotIndex) => {
        if (processedItems.has(item._id.toString())) {
          return;
        }

        processedItems.add(item._id.toString());

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
