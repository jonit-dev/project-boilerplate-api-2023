/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";

import { ItemPickup } from "@providers/item/ItemPickup";
import { CharacterItems } from "../characterItems/CharacterItems";
import { CharacterTrading } from "@providers/character/CharacterTrading";

describe("CharacterTrading.ts", () => {
  let testItem: IItem;
  let testGtItem: IItem;
  let testCharacter: ICharacter;
  let npcCharacter: ICharacter;
  let itemTrading: CharacterTrading;
  let itemPickup: ItemPickup;
  let inventory: IItem;
  let npcInvetory: IItem;
  let inventoryItemContainerId: string;
  let npcInventoryItemContainerId: string;
  let characterItems: CharacterItems;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    characterItems = container.get<CharacterItems>(CharacterItems);

    itemPickup = container.get<ItemPickup>(ItemPickup);
    itemTrading = container.get<CharacterTrading>(CharacterTrading);
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
      goldPrice: 100,
    });
    testGtItem = await unitTestHelper.createMockItem({
      x: testCharacter.x,
      y: testCharacter.y,
      scene: testCharacter.scene,
      weight: 0,
      goldPrice: 150,
    });
    inventory = await testCharacter.inventory;
    inventoryItemContainerId = inventory.itemContainer as unknown as string;
    npcInvetory = await npcCharacter.inventory;
    npcInventoryItemContainerId = npcInvetory.itemContainer as unknown as string;
  });

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

  const npcPickupAnotherItem = async (toContainerId: string, extraProps?: Record<string, unknown>) => {
    const itemAdded = await itemPickup.performItemPickup(
      {
        itemId: testGtItem.id,
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
    const itemSelled = await itemTrading.performItemSell(
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

  const buyItem = async (fromContainerId: string, toContainerId: string, extraProps?: Record<string, unknown>) => {
    const itemBuyed = await itemTrading.performItemBuy(
      {
        itemId: testItem.id,
        x: npcCharacter.x,
        y: npcCharacter.y,
        scene: npcCharacter.scene,
        toContainerId: fromContainerId,
        fromContainerId: toContainerId,
        ...extraProps,
      },
      testCharacter,
      npcCharacter
    );
    return itemBuyed;
  };

  const sellAnotherItem = async (
    fromContainerId: string,
    toContainerId: string,
    extraProps?: Record<string, unknown>
  ) => {
    const itemSelled = await itemTrading.performItemSell(
      {
        itemId: testGtItem.id,
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

  const buyAnotherItem = async (
    fromContainerId: string,
    toContainerId: string,
    extraProps?: Record<string, unknown>
  ) => {
    const itemBuyed = await itemTrading.performItemBuy(
      {
        itemId: testGtItem.id,
        x: npcCharacter.x,
        y: npcCharacter.y,
        scene: npcCharacter.scene,
        toContainerId: fromContainerId,
        fromContainerId: toContainerId,
        ...extraProps,
      },
      testCharacter,
      npcCharacter
    );
    return itemBuyed;
  };

  it("should sell an item from invetory to NPC", async () => {
    const itemPickedUp = await npcPickupItem(npcInventoryItemContainerId);

    expect(itemPickedUp).toBeTruthy();

    const itemSelled = await sellItem(npcInventoryItemContainerId, inventoryItemContainerId);

    expect(itemSelled).toBeTruthy();

    const result = await characterItems.hasItem(testItem.id, testCharacter, "inventory");

    expect(result).toBe(true);

    const anotherSellForTheSameItem = await sellItem(npcInventoryItemContainerId, inventoryItemContainerId);

    expect(anotherSellForTheSameItem).toBeFalsy();
  });

  it("should not sell an item from invetory to NPC if have a price greater than the total amount of gold", async () => {
    const itemPickedUp = await npcPickupItem(npcInventoryItemContainerId);

    expect(itemPickedUp).toBeTruthy();

    const itemSelled = await sellItem(npcInventoryItemContainerId, inventoryItemContainerId);

    expect(itemSelled).toBeTruthy();

    const itemPickedUpAnother = await npcPickupAnotherItem(npcInventoryItemContainerId);

    expect(itemPickedUpAnother).toBeTruthy();

    const itemSelected = await sellAnotherItem(npcInventoryItemContainerId, inventoryItemContainerId);

    expect(itemSelected).toBeFalsy();
  });

  it("should but an item from NPC to inventory", async () => {
    const itemPickedUp = await npcPickupItem(npcInventoryItemContainerId);

    expect(itemPickedUp).toBeTruthy();

    const itemSelled = await buyItem(npcInventoryItemContainerId, inventoryItemContainerId);

    expect(itemSelled).toBeTruthy();

    const result = await characterItems.hasItem(testItem.id, testCharacter, "inventory");

    expect(result).toBe(true);

    const anotherSellForTheSameItem = await buyItem(npcInventoryItemContainerId, inventoryItemContainerId);

    expect(anotherSellForTheSameItem).toBeFalsy();
  });

  it("should not sell an item from NPC to inventory if have a price greater than the total amount of gold", async () => {
    const itemPickedUp = await npcPickupItem(npcInventoryItemContainerId);

    expect(itemPickedUp).toBeTruthy();

    const itemSelled = await buyItem(npcInventoryItemContainerId, inventoryItemContainerId);

    expect(itemSelled).toBeTruthy();

    const itemPickedUpAnother = await npcPickupAnotherItem(npcInventoryItemContainerId);

    expect(itemPickedUpAnother).toBeTruthy();

    const itemSelected = await buyAnotherItem(npcInventoryItemContainerId, inventoryItemContainerId);

    expect(itemSelected).toBeFalsy();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
