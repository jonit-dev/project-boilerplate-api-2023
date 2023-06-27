import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { FullCRUD } from "@providers/mongoDB/FullCRUD";
import { provide } from "inversify-binding-decorators";
import { clearCacheForKey } from "speedgoose";

@provide(ItemContainerRepository)
export class ItemContainerRepository extends FullCRUD {
  constructor(private analyticsHelper: AnalyticsHelper) {
    super(analyticsHelper);
  }

  public async createItemContainer(
    parentItem: IItem,
    itemContainerProps: Partial<IItemContainer>
  ): Promise<IItemContainer> {
    const newItemContainer = new ItemContainer({
      ...itemContainerProps,
    });

    const slotsQty = newItemContainer.slotQty;

    console.log("creating item container with slotsQty: ", slotsQty);

    const slots = {};

    for (let i = 0; i < slotsQty; i++) {
      slots[Number(i)] = null;
    }
    newItemContainer.slots = slots;
    // @ts-ignore
    newItemContainer.parentItem.id;
    await newItemContainer.save();

    await clearCacheForKey(`${newItemContainer._id}-targetContainer`);
    await clearCacheForKey(`${newItemContainer._id}-inventoryContainer`);

    parentItem.isItemContainer = true;
    parentItem.itemContainer = newItemContainer._id;
    await parentItem.save();

    return newItemContainer;
  }
}
