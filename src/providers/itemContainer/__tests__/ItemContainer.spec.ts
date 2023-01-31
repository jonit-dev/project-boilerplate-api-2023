import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY } from "@rpg-engine/shared";

describe("ItemContainer.ts", () => {
  let testCharacter: ICharacter;
  let testItem: IItem;
  let testContainer: IItemContainer;

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    testItem = await unitTestHelper.createMockItem();

    testCharacter.x = FromGridX(1);
    testCharacter.y = FromGridY(0);
    testItem.x = testCharacter.x;
    testItem.y = testCharacter.y;
    await testCharacter.save();
    await testItem.save();

    const inventory = await testCharacter.inventory;

    testContainer = new ItemContainer({
      parentItem: inventory.id,
      slotQty: 20,
    });
    await testContainer.save();
  });

  it("should properly return the itemContainer totalItemsQty", async () => {
    expect(testContainer.totalItemsQty).toBe(0);

    // add new item to inventoryContainer

    testContainer.slots[0] = testItem;
    await testContainer.save();

    expect(testContainer.totalItemsQty).toBe(1);
  });

  it("should properly tell if a container is empty or not", async () => {
    expect(testContainer.isEmpty).toBe(true);

    testContainer.slots[0] = testItem;
    await testContainer.save();

    expect(testContainer.isEmpty).toBe(false);
    expect(testContainer.totalItemsQty).toBe(1);
  });

  it("should return all itemIds stored properly", async () => {
    testContainer.slots[0] = testItem;
    await testContainer.save();

    const itemIds = await testContainer.itemIds;
    expect(itemIds.length).toBe(1);
    expect(itemIds[0]).toBe(testItem.id);
  });

  it("should properly generate the slots, after its created", async () => {
    expect(testContainer.emptySlotsQty).toBe(20);

    testContainer.slots[0] = testItem;
    await testContainer.save();
    expect(testContainer.emptySlotsQty).toBe(19);
  });

  it("should properly get the first available slot content", () => {
    expect(testContainer.firstAvailableSlot).toBeNull();
  });

  it("should properly get the first available slot ID", async () => {
    expect(testContainer.firstAvailableSlotId).toBe(0);

    testContainer.slots[0] = testItem;
    await testContainer.save();

    expect(testContainer.firstAvailableSlotId).toBe(1);
  });
});
