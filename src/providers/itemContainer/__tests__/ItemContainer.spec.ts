import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ItemPickup } from "@providers/item/ItemPickup";
import { FromGridX, FromGridY } from "@rpg-engine/shared";

describe("ItemContainer.ts", () => {
  let testCharacter: ICharacter;
  let testItem: IItem;
  let inventoryContainer: IItemContainer;
  let itemPickup: ItemPickup;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    itemPickup = container.get<ItemPickup>(ItemPickup);
  });

  const getInventoryContainer = async (): Promise<IItemContainer> => {
    const inventory = await testCharacter.inventory;
    const itemContainer = await ItemContainer.findOne({
      parentItem: inventory.id,
    });
    return itemContainer as unknown as IItemContainer;
  };

  const pickupItem = async (extraProps?: Record<string, unknown>): Promise<Boolean> => {
    const inventoryContainer = await getInventoryContainer();

    const itemAdded = await itemPickup.performItemPickup(
      {
        itemId: testItem.id,
        x: testCharacter.x,
        y: testCharacter.y,
        scene: testCharacter.scene,
        toContainerId: inventoryContainer.id as unknown as string,
        ...extraProps,
      },
      testCharacter
    );
    return itemAdded;
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
    console.log("before pickup: ", inventoryContainer.id, inventoryContainer.totalItemsQty);

    expect(inventoryContainer.totalItemsQty).toBe(0);

    const itemAdd = await pickupItem();
    expect(itemAdd).toBeTruthy();

    inventoryContainer = await getInventoryContainer();

    console.log("after pickup: ", inventoryContainer.id, inventoryContainer.totalItemsQty);

    expect(inventoryContainer.totalItemsQty).toBe(1);
  });

  it("should properly tell if a container is empty or not", async () => {
    expect(inventoryContainer.isEmpty).toBe(true);

    const itemAdded = await pickupItem();

    expect(itemAdded).toBeTruthy();

    expect(inventoryContainer.isEmpty).toBe(false);
    expect(inventoryContainer.totalItemsQty).toBe(1);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
