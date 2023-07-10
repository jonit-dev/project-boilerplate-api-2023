import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { ItemContainerHelper } from "@providers/itemContainer/ItemContainerHelper";
import { IItemContainer, ItemType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ItemWeightTracker)
export class ItemWeightTracker {
  constructor(private itemContainerHelper: ItemContainerHelper) {}

  @TrackNewRelicTransaction()
  public async setItemWeightTracking(item: IItem, character: ICharacter): Promise<void> {
    await Item.updateOne({ _id: item._id }, { carrier: character._id, owner: character._id });

    if (item.type === ItemType.Container) {
      const itemContainer = (await ItemContainer.findById(item.itemContainer).lean()) as unknown as IItemContainer;

      if (!itemContainer) {
        throw new Error("ItemCarrier: Item container not found");
      }

      await this.itemContainerHelper.execFnInAllItemContainerSlots(itemContainer, async (item, slotIndex) => {
        await this.setItemWeightTracking(item, character);
      });
    }
  }

  @TrackNewRelicTransaction()
  public async removeItemWeightTracking(item: IItem): Promise<void> {
    await Item.updateOne(
      {
        _id: item._id,
      },
      {
        $unset: { carrier: "" },
      }
    );

    if (item.type === ItemType.Container) {
      const itemContainer = (await ItemContainer.findById(item.itemContainer)) as unknown as IItemContainer;

      if (!itemContainer) {
        throw new Error("ItemCarrier: Item container not found");
      }

      await this.itemContainerHelper.execFnInAllItemContainerSlots(itemContainer, async (item, slotIndex) => {
        await this.removeItemWeightTracking(item);
      });
    }
  }
}
