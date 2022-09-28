/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EquipmentEquip } from "../../equipment/EquipmentEquip";

import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { ItemPickup } from "@providers/item/ItemPickup";

describe("CharacterItems.ts", () => {
  let testItem: IItem;
  let testCharacter: ICharacter;
  let itemPickup: ItemPickup;
  let inventory: IItem;
  let inventoryItemContainerId: string;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemPickup = container.get<ItemPickup>(ItemPickup);
    equipmentEquip = container.get<EquipmentEquip>(EquipmentEquip);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await (
      await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true, hasSkills: true })
    )
      .populate("skills")
      .execPopulate();
    testItem = await unitTestHelper.createStackableMockItem({
      x: testCharacter.x,
      y: testCharacter.y,
      scene: testCharacter.scene,
      weight: 0,
      stackQty: 25,
      isStackable: true,
      maxStackSize: 100,
    });
    inventory = await testCharacter.inventory;
    inventoryItemContainerId = inventory.itemContainer as unknown as string;

    // add testItem to the inventory
    await pickupItem(testItem, inventoryItemContainerId);
  });

  const pickupItem = async (item: IItem, toContainerId: string, extraProps?: Record<string, unknown>) => {
    const itemAdded = await itemPickup.performItemPickup(
      {
        itemId: item.id,
        x: testCharacter.x,
        y: testCharacter.y,
        scene: testCharacter.scene,
        toContainerId,
        ...extraProps,
      },
      testCharacter
    );
    return itemAdded;
  };

  it("should add to stack if character has stackable item on its container, and we didn't reach the max stack size.", async () => {
    const itemAdded = await pickupItem(testItem, inventoryItemContainerId);

    expect(itemAdded).toBe(true);

    const updatedInventoryContainer = await ItemContainer.findById(inventoryItemContainerId);

    const stackedItem = updatedInventoryContainer?.slots[0];

    expect(stackedItem.stackQty).toBe(50);
  });

  it("Increase stack size to max, and create a new item with the difference. if character has stackable item on its container, and we reached the max stack size.", async () => {
    testItem.stackQty = 85;
    await testItem.save();
    const itemAdded = await pickupItem(testItem, inventoryItemContainerId);

    expect(itemAdded).toBe(true); // we're adding a new item here! The stack should be maxed and the new one created as new item

    const updatedInventoryContainer = await ItemContainer.findById(inventoryItemContainerId);

    const firstSlotItem = updatedInventoryContainer?.slots[0];
    const secondSlotItem = updatedInventoryContainer?.slots[1];

    expect(firstSlotItem.stackQty).toBe(100);
    expect(secondSlotItem.stackQty).toBe(10);
  });

  it("should create a new item on target container, if no similar stackable item is found on it.", async () => {
    // erase first item on inventoryContainer
    await ItemContainer.updateOne(
      {
        _id: inventoryItemContainerId,
      },
      {
        $set: {
          slots: {
            0: null,
          },
        },
      }
    );

    const itemAdded = await pickupItem(testItem, inventoryItemContainerId);

    const updatedInventoryContainer = await ItemContainer.findById(inventoryItemContainerId);

    expect(itemAdded).toBe(true); // no stackable item on the target container, so it should create a new one.

    const itemFirstSlot = updatedInventoryContainer?.slots[0];

    expect(itemFirstSlot.stackQty).toBe(25);
  });

  it("should fail if no slots are available for creating the difference stack", async () => {});

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
