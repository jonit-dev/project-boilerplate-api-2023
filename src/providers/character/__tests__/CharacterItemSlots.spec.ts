/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { CharacterItemSlots } from "../characterItems/CharacterItemSlots";

describe("CharacterItemSlots.ts", () => {
  let characterItemSlots: CharacterItemSlots;
  let testItem: IItem;
  let inventory: IItem;
  let testCharacter: ICharacter;
  let inventoryItemContainerId: string;
  let inventoryContainer: IItemContainer;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    characterItemSlots = container.get<CharacterItemSlots>(CharacterItemSlots);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await (
      await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true, hasSkills: true })
    )
      .populate("skills")
      .execPopulate();
    testItem = await unitTestHelper.createMockItem();
    inventory = await testCharacter.inventory;
    inventoryItemContainerId = inventory.itemContainer as unknown as string;
    inventoryContainer = (await ItemContainer.findById(inventoryItemContainerId)) as unknown as IItemContainer;

    testCharacter.x = FromGridX(1);
    testCharacter.y = FromGridY(0);
    await testCharacter.save();
    await testItem.save();
  });

  describe("Quantity calculation", () => {
    it("should properly calculate qty of a NON-STACKABLE item", async () => {
      const firstItem = await unitTestHelper.createMockItem();
      const secondItem = await unitTestHelper.createMockItem();
      inventoryContainer.slots = {
        ...inventoryContainer.slots,
        0: firstItem.toJSON({ virtuals: true }),
        1: secondItem.toJSON({ virtuals: true }),
      };
      await inventoryContainer.save();

      const qty = await characterItemSlots.getTotalQty(inventoryContainer, firstItem.key);

      expect(qty).toBe(2);
    });

    it("should properly calculate qty of a STACKABLE item", async () => {
      const firstItem = await unitTestHelper.createStackableMockItem({
        stackQty: 25,
      });
      const secondItem = await unitTestHelper.createStackableMockItem({
        stackQty: 25,
      });
      inventoryContainer.slots = {
        ...inventoryContainer.slots,
        0: firstItem.toJSON({ virtuals: true }),
        1: secondItem.toJSON({ virtuals: true }),
      };
      await inventoryContainer.save();

      const qty = await characterItemSlots.getTotalQty(inventoryContainer, firstItem.key);

      expect(qty).toBe(50);
    });
  });

  it("should get all items from a specific key", async () => {
    const firstItem = await unitTestHelper.createMockItem();
    const secondItem = await unitTestHelper.createMockItem();
    const thirdItem = await unitTestHelper.createMockItem({
      key: "different-item",
    });

    inventoryContainer.slots = {
      ...inventoryContainer.slots,
      0: firstItem.toJSON({ virtuals: true }),
      1: thirdItem.toJSON({ virtuals: true }),
      2: secondItem.toJSON({ virtuals: true }),
    };
    await inventoryContainer.save();

    const itemsSameKey = characterItemSlots.getAllItemsFromKey(inventoryContainer, firstItem.key);

    expect(itemsSameKey.length).toBe(2);

    expect(itemsSameKey[0].key).toBe(firstItem.key);
    expect(itemsSameKey[1].key).toBe(secondItem.key);
  });

  it("should properly find a specific item in a container slot", async () => {
    const firstItem = await unitTestHelper.createMockItem();

    inventoryContainer.slots = {
      ...inventoryContainer.slots,
      0: firstItem.toJSON({ virtuals: true }),
    };
    await inventoryContainer.save();

    const foundItem = await characterItemSlots.findItemOnSlots(inventoryContainer, firstItem.id);

    expect(foundItem).toBeDefined();

    expect(foundItem?._id).toEqual(firstItem._id);
  });

  it("should properly delete an item on a targeted slot", async () => {
    const firstItem = await unitTestHelper.createMockItem();

    inventoryContainer.slots = {
      ...inventoryContainer.slots,
      0: firstItem.toJSON({ virtuals: true }),
    };
    await inventoryContainer.save();

    const deleteItem = await characterItemSlots.deleteItemOnSlot(inventoryContainer, firstItem.id);

    expect(deleteItem).toBeTruthy();

    const foundItem = await characterItemSlots.findItemOnSlots(inventoryContainer, firstItem.id);

    expect(foundItem).toBeUndefined();
  });

  it("should find an item by slot index", async () => {
    const firstItem = await unitTestHelper.createMockItem();

    inventoryContainer.slots = {
      ...inventoryContainer.slots,
      5: firstItem.toJSON({ virtuals: true }),
    };
    await inventoryContainer.save();

    const slotIndex = await characterItemSlots.findItemSlotIndex(inventoryContainer, firstItem.id);

    expect(slotIndex).toEqual(5);
  });

  it("should find an item with the same key", async () => {
    const firstItem = await unitTestHelper.createMockItem();
    const secondItem = await unitTestHelper.createMockItem();

    inventoryContainer.slots = {
      ...inventoryContainer.slots,
      0: firstItem.toJSON({ virtuals: true }),
    };
    await inventoryContainer.save();

    const itemSameKey = await characterItemSlots.findItemWithSameKey(inventoryContainer, secondItem.key);

    expect(itemSameKey).toBeDefined();

    expect(itemSameKey?._id).toEqual(firstItem._id);
    expect(itemSameKey?.key).toEqual(secondItem.key);
  });

  it("should properly get the first available slot", async () => {
    inventoryContainer.slotQty = 1;
    inventoryContainer.slots = {
      0: undefined,
    };
    await inventoryContainer.save();

    const firstAvailableSlot = await characterItemSlots.getFirstAvailableSlotIndex(inventoryContainer);

    const firstItem = await unitTestHelper.createMockItem();

    expect(firstAvailableSlot).toBe(0);

    inventoryContainer.slotQty = 2;
    inventoryContainer.slots = {
      0: firstItem.toJSON({ virtuals: true }),
      1: undefined,
    };
    await inventoryContainer.save();

    const secondAvailableSlot = await characterItemSlots.getFirstAvailableSlotIndex(inventoryContainer);

    expect(secondAvailableSlot).toBe(1);

    const stackableItem = await unitTestHelper.createStackableMockItem({ stackQty: 1, maxStackSize: 2 });

    // check next available slot on half stack and full stack
    inventoryContainer.slotQty = 2;
    inventoryContainer.slots = {
      0: stackableItem.toJSON({ virtuals: true }),
      1: undefined,
    };
    await inventoryContainer.save();

    const halfStack = await characterItemSlots.getFirstAvailableSlotIndex(inventoryContainer, stackableItem);

    expect(halfStack).toBe(0);

    // check next available slot on half stack and full stack
    inventoryContainer.slotQty = 2;
    stackableItem.stackQty = 2;
    await stackableItem.save();
    inventoryContainer.slots = {
      0: stackableItem.toJSON({ virtuals: true }),
      1: undefined,
    };
    await inventoryContainer.save();

    const fullStackAvailableSlot = await characterItemSlots.getFirstAvailableSlotIndex(
      inventoryContainer,
      stackableItem
    );

    expect(fullStackAvailableSlot).toBe(1);
  });

  it("should properly check if there're available slots on a NON-STACKABLE item", async () => {
    const newItem = await unitTestHelper.createMockItem();
    const hasAvailableSlot = await characterItemSlots.hasAvailableSlot(inventoryItemContainerId, newItem);

    expect(hasAvailableSlot).toBeTruthy();
  });

  it("should properly check if there're available slots on a STACKABLE item", async () => {
    const stackableItem = await unitTestHelper.createStackableMockItem({
      stackQty: 7,
      maxStackSize: 10,
    });

    const inventoryContainer = (await ItemContainer.findById(inventoryItemContainerId)) as unknown as IItemContainer;

    if (!inventoryContainer) {
      throw new Error("Inventory container not found");
    }

    inventoryContainer.slotQty = 1;
    inventoryContainer.slots = {
      0: undefined,
    };
    await inventoryContainer.save();

    const hasAvailableSlot = await characterItemSlots.hasAvailableSlot(inventoryContainer.id, stackableItem);

    expect(hasAvailableSlot).toBeTruthy();

    inventoryContainer.slotQty = 1;
    inventoryContainer.slots = {
      0: stackableItem.toJSON({ virtuals: true }),
    };
    await inventoryContainer.save();

    const stackableItem2 = await unitTestHelper.createStackableMockItem({
      stackQty: 10,
      maxStackSize: 10,
    });
    const hasAvailableSlot2 = await characterItemSlots.hasAvailableSlot(inventoryContainer.id, stackableItem2);

    expect(hasAvailableSlot2).toBeFalsy();
  });

  it("should properly add item on first available slot", async () => {
    const stackableItem = await unitTestHelper.createStackableMockItem({
      stackQty: 9,
      maxStackSize: 10,
    });

    const inventoryContainer = (await ItemContainer.findById(inventoryItemContainerId)) as unknown as IItemContainer;

    inventoryContainer.slots = {
      0: stackableItem.toJSON({ virtuals: true }),
    };
    await inventoryContainer.save();

    if (!inventoryContainer) {
      throw new Error("Inventory container not found");
    }

    const anotherStackableItem = await unitTestHelper.createStackableMockItem({
      stackQty: 1,
      maxStackSize: 10,
    });

    const result = await characterItemSlots.addItemOnFirstAvailableSlot(anotherStackableItem, inventoryContainer);

    console.log(result);

    console.log("inventoryContainer.slots", inventoryContainer.slots);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
