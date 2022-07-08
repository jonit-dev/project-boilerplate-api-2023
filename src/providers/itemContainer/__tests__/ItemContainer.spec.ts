import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY } from "@rpg-engine/shared";

describe("ItemContainer.ts", () => {
  let testCharacter: ICharacter;
  let testItem: IItem;
  let inventoryContainer: IItemContainer;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });

  const getInventoryContainer = async (): Promise<IItemContainer> => {
    const inventory = await testCharacter.inventory;
    const itemContainer = await ItemContainer.findOne({
      parentItem: inventory.id,
    });
    return itemContainer as unknown as IItemContainer;
  };

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    testItem = await unitTestHelper.createMockItem();

    testCharacter.x = FromGridX(1);
    testCharacter.y = FromGridY(0);
    testItem.x = testCharacter.x;
    testItem.y = testCharacter.y;
    await testCharacter.save();
    await testItem.save();

    inventoryContainer = await getInventoryContainer();
  });

  it("should properly return the itemContainer totalItemsQty", async () => {
    expect(inventoryContainer.totalItemsQty).toBe(0);

    // add new item to inventoryContainer

    inventoryContainer.slots[0] = testItem;
    await inventoryContainer.save();

    expect(inventoryContainer.totalItemsQty).toBe(1);
  });

  it("should properly tell if a container is empty or not", async () => {
    expect(inventoryContainer.isEmpty).toBe(true);

    inventoryContainer.slots[0] = testItem;
    await inventoryContainer.save();

    expect(inventoryContainer.isEmpty).toBe(false);
    expect(inventoryContainer.totalItemsQty).toBe(1);
  });

  it("should return all itemIds stored properly", async () => {
    inventoryContainer.slots[0] = testItem;
    await inventoryContainer.save();

    const itemIds = await inventoryContainer.itemIds;
    expect(itemIds.length).toBe(1);
    expect(itemIds[0]).toBe(testItem.id);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
