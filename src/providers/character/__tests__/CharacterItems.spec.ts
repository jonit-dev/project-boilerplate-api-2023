/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EquipmentEquip } from "../../equipment/EquipmentEquip";

import { ItemPickup } from "@providers/item/ItemPickup";
import { CharacterItems } from "../CharacterItems";

describe("CharacterItems.ts", () => {
  let testItem: IItem;
  let testCharacter: ICharacter;
  let npcCharacter: ICharacter;
  let itemSelled: ItemPickup;
  let itemPickup: ItemPickup;
  let inventory: IItem;
  let npcInvetory: IItem;
  let inventoryItemContainerId: string;
  let npcInventoryItemContainerId: string;
  let equipmentEquip: EquipmentEquip;
  let characterItems: CharacterItems;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    characterItems = container.get<CharacterItems>(CharacterItems);

    itemSelled = container.get<ItemPickup>(ItemPickup);
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
    npcCharacter = await (
      await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true, hasSkills: true })
    )
      .populate("skills")
      .execPopulate();
    testItem = await unitTestHelper.createMockItem({
      x: testCharacter.x,
      y: testCharacter.y,
      scene: testCharacter.scene,
      weight: 0,
    });
    inventory = await testCharacter.inventory;
    inventoryItemContainerId = inventory.itemContainer as unknown as string;
    npcInvetory = await npcCharacter.inventory;
    npcInventoryItemContainerId = npcInvetory.itemContainer as unknown as string;
  });

  const pickupItem = async (toContainerId: string, extraProps?: Record<string, unknown>) => {
    const itemAdded = await itemPickup.performItemPickup(
      {
        itemId: testItem.id,
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

  const npcPickupItem = async (toContainerId: string, extraProps?: Record<string, unknown>) => {
    const itemAdded = await itemPickup.performItemPickup(
      {
        itemId: testItem.id,
        x: npcCharacter.x,
        y: npcCharacter.y,
        scene: npcCharacter.scene,
        toContainerId,
        ...extraProps,
      },
      npcCharacter
    );
    return itemAdded;
  };

  const sellItem = async (fromContainerId: string, toContainerId: string, extraProps?: Record<string, unknown>) => {
    const itemSelled = await itemPickup.performItemSell(
      {
        itemId: testItem.id,
        x: npcCharacter.x,
        y: npcCharacter.y,
        scene: npcCharacter.scene,
        toContainerId: fromContainerId,
        fromContainerId: toContainerId,
        ...extraProps,
      },
      npcCharacter,
      testCharacter
    );
    return itemSelled;
  };

  it("should sell an item from invetory to NPC", async () => {
    const itemPickedUp = await npcPickupItem(npcInventoryItemContainerId);

    expect(itemPickedUp).toBeTruthy();

    const _itemSelled = await sellItem(npcInventoryItemContainerId, inventoryItemContainerId);

    expect(itemSelled).toBeTruthy();

    const result = await characterItems.hasItem(testItem.id, testCharacter, "inventory");

    expect(result).toBe(true);
  });

  it("should properly identify an item on the inventory", async () => {
    const itemPickedUp = await pickupItem(inventoryItemContainerId);

    expect(itemPickedUp).toBeTruthy();

    const result = await characterItems.hasItem(testItem.id, testCharacter, "inventory");

    expect(result).toBe(true);
  });

  it("should properly identify an item on the equipment", async () => {
    const itemPickedUp = await pickupItem(inventoryItemContainerId);
    expect(itemPickedUp).toBeTruthy();
    // try to equip the test item
    await equipmentEquip.equip(testCharacter, testItem.id, inventoryItemContainerId);

    const result = await characterItems.hasItem(testItem.id, testCharacter, "equipment");

    expect(result).toBe(true);
  });

  it("should properly remove an item from the inventory", async () => {
    const itemPickedUp = await pickupItem(inventoryItemContainerId);
    expect(itemPickedUp).toBeTruthy();

    const result = await characterItems.deleteItem(testItem.id, testCharacter, "inventory");

    expect(result).toBe(true);
  });

  it("should properly remove an item from the equipment", async () => {
    const itemPickedUp = await pickupItem(inventoryItemContainerId);
    expect(itemPickedUp).toBeTruthy();
    // try to equip the test item
    await equipmentEquip.equip(testCharacter, testItem.id, inventoryItemContainerId);

    const result = await characterItems.deleteItem(testItem.id, testCharacter, "equipment");

    expect(result).toBe(true);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
