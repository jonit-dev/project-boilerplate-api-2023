import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemNPCBody } from "@providers/item/data/blueprints/bodies/ItemNPCBody";
import { ItemContainerBodyCleaner } from "../ItemContainerBodyCleaner";

describe("ItemContainerBodyCleaner.spec.ts", () => {
  let testItem: IItem;
  let testBodyItem: IItem;
  let testItemContainer: IItemContainer;
  let itemContainerCleaner: ItemContainerBodyCleaner;

  beforeAll(() => {
    itemContainerCleaner = container.get(ItemContainerBodyCleaner);
  });

  beforeEach(async () => {
    testItem = await unitTestHelper.createMockItem();

    testBodyItem = await unitTestHelper.createMockItem({
      ...itemNPCBody,
    });

    testItemContainer = (await ItemContainer.findById(testBodyItem.itemContainer)) as IItemContainer;
  });

  it("should clean all items inside a dead body", async () => {
    testItemContainer.slots = {
      0: testItem,
    };

    await testItemContainer.save();

    const initialItemsQty = testItemContainer?.itemIds?.length;

    expect(initialItemsQty).toBe(1);

    await itemContainerCleaner.cleanupBodies();

    testItemContainer = (await ItemContainer.findById(testItemContainer._id)) as IItemContainer;

    expect(testItemContainer).toBeNull();

    const hasTestItem = await Item.findById(testItem._id);

    expect(hasTestItem).toBeNull();
  });
});
