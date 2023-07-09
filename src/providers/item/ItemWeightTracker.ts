import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { IItemContainer, ItemType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ItemWeightTracker)
export class ItemWeightTracker {
  constructor() {}

  @TrackNewRelicTransaction()
  public async setItemWeightTracking(item: IItem, character: ICharacter): Promise<void> {
    await Item.updateOne({ _id: item._id }, { carrier: character._id, owner: character._id });

    if (item.type === ItemType.Container) {
      const itemContainer = (await ItemContainer.findById(item.itemContainer).lean()) as unknown as IItemContainer;

      if (!itemContainer) {
        throw new Error("ItemCarrier: Item container not found");
      }

      await this.loopThroughAllItemsInContainerAndCallback(itemContainer, async (item, slotIndex) => {
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

      await this.loopThroughAllItemsInContainerAndCallback(itemContainer, async (item, slotIndex) => {
        await this.removeItemWeightTracking(item);
      });
    }
  }

  @TrackNewRelicTransaction()
  private async loopThroughAllItemsInContainerAndCallback(
    itemContainer: IItemContainer,
    fn: (item: IItem, slotIndex: number) => Promise<void>
  ): Promise<void> {
    const slots = itemContainer.slots;

    for (const [slotIndex, itemData] of Object.entries(slots)) {
      const item = itemData as IItem;

      if (item) {
        await fn(item, Number(slotIndex));
      }
    }
  }
}
