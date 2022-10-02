import { container, unitTestHelper } from "@providers/inversify/container";
import { ItemUse } from "../ItemUse";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { stackableItemMock } from "@providers/unitTests/mock/itemMock";
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { CharacterSocketEvents, ItemSocketEvents } from "@rpg-engine/shared";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { itemApple } from "../data/blueprints/foods/ItemApple";
import { EquipmentEquip } from "@providers/equipment/EquipmentEquip";
import { itemLightLifePotion } from "../data/blueprints/potions/ItemLightLifePotion";

describe("ItemUse.ts", () => {
  let itemUse: ItemUse;
  let characterWeight: CharacterWeight;
  let testCharacter: ICharacter;
  let testItem: IItem;
  let inventory: IItem;
  let inventoryItemContainerId: string;
  let sendEventToUser: jest.SpyInstance;
  let itemUsageMock: jest.SpyInstance;
  let equipmentEquip: EquipmentEquip;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemUse = container.get<ItemUse>(ItemUse);
    characterWeight = container.get<CharacterWeight>(CharacterWeight);
    equipmentEquip = container.get<EquipmentEquip>(EquipmentEquip);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await (
      await unitTestHelper.createMockCharacter(
        { health: 50 },
        { hasEquipment: true, hasInventory: true, hasSkills: true }
      )
    )
      .populate("skills")
      .execPopulate();

    testItem = new Item(stackableItemMock);
    testItem.stackQty = 2;
    await testItem.save();

    inventory = await testCharacter.inventory;
    inventoryItemContainerId = inventory.itemContainer as unknown as string;
    await addItemToInventory(testItem);

    await testCharacter.save();

    sendEventToUser = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");

    itemUsageMock = jest.spyOn(itemUse as any, "applyItemUsage");
    itemUsageMock.mockImplementation();
  });

  afterEach(() => {
    sendEventToUser.mockRestore();
    itemUsageMock.mockRestore();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });

  const getInventoryContainer = async (): Promise<IItemContainer> => {
    return (await ItemContainer.findById(inventoryItemContainerId)) as unknown as IItemContainer;
  };

  const getInventoryItem = async (): Promise<IItem> => {
    const container = await getInventoryContainer();
    return container.slots[0];
  };

  const addItemToInventory = async (item: IItem): Promise<IItem> => {
    const bag = await getInventoryContainer();
    if (bag) {
      bag.slots[0] = item;
      await ItemContainer.updateOne(
        {
          _id: bag.id,
        },
        {
          $set: {
            slots: bag.slots,
          },
        }
      );
    }
    return item;
  };

  it("should consume item successfully", async () => {
    const result = await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);
    expect(result).toBeTruthy();
  });

  it("should call item usage cycle", async () => {
    // TODO: test applyItemUsage separatey
    await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);

    expect(itemUsageMock).toBeCalledTimes(1);
    expect(itemUsageMock).toBeCalledWith(itemApple, testCharacter.id);
  });

  it("should decrease character weight, after an item is consumed", async () => {
    const currentWeight = await characterWeight.getWeight(testCharacter);
    expect(currentWeight).toBe(3.05);

    /* stackable item quantity does not affect character weight, 
        only base item weight does, so need to consume all quantity */

    await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);
    await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);

    const afterWeight = await characterWeight.getWeight(testCharacter);
    expect(afterWeight).toBe(3);
  });

  it("should decrement item from inventory, after item is consumed", async () => {
    let item = await getInventoryItem();
    expect(item.stackQty).toBe(2);

    await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);

    item = await getInventoryItem();
    expect(item.stackQty).toBe(1);

    await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);

    item = await getInventoryItem();
    expect(item).toBeNull();
  });

  it("should decrement stackable item from inventory, after item is consumed", async () => {
    let item = (await Item.findById(testItem.id)) as unknown as IItem;
    expect(item.stackQty).toBe(2);

    await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);

    item = (await Item.findById(testItem.id)) as unknown as IItem;
    expect(item.stackQty).toBe(1);

    await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);

    item = (await Item.findById(testItem.id)) as unknown as IItem;
    expect(item).toBeNull();
  });

  it("should send an inventory update socket event", async () => {
    await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);

    expect(sendEventToUser).toBeCalledTimes(1);

    const inventoryContainer = await getInventoryContainer();

    expect(sendEventToUser).toBeCalledWith(testCharacter.channelId, ItemSocketEvents.EquipmentAndInventoryUpdate, {
      equipment: {},
      inventory: {
        _id: inventoryContainer._id,
        parentItem: inventoryContainer!.parentItem.toString(),
        owner: inventoryContainer?.owner?.toString() || testCharacter.name,
        name: inventoryContainer?.name,
        slotQty: inventoryContainer!.slotQty,
        slots: inventoryContainer?.slots,
        allowedItemTypes: equipmentEquip.getAllowedItemTypes(),
        isEmpty: inventoryContainer!.isEmpty,
      },
    });
  });

  it("should increase character health incrementally for food item", async () => {
    itemUsageMock.mockRestore();
    jest.useFakeTimers({ advanceTimers: true, doNotFake: ["setInterval", "clearInterval"] });

    (itemUse as any).applyItemUsage(itemApple, testCharacter.id);

    await wait(0.2);

    jest.advanceTimersByTime(11000);
    await wait(0.2);

    jest.advanceTimersByTime(11000);
    await wait(0.2);

    jest.advanceTimersByTime(11000);
    await wait(0.2);

    jest.advanceTimersByTime(11000);
    await wait(0.2);

    // extra call to make sure cycle is only running for 5 times
    jest.advanceTimersByTime(11000);
    await wait(0.2);

    expect(sendEventToUser).toBeCalledTimes(5);

    for (let i = 1; i <= 5; i++) {
      expect(sendEventToUser).toHaveBeenNthCalledWith(i, testCharacter.channelId, CharacterSocketEvents.ItemConsumed, {
        targetId: testCharacter._id,
        health: testCharacter.health + i,
      });
    }

    const character = (await Character.findById(testCharacter.id)) as unknown as ICharacter;
    expect(character.health).toBe(testCharacter.health + 5);
  });

  it("should increase character health instantly for potions", async () => {
    itemUsageMock.mockRestore();
    jest.useFakeTimers({ advanceTimers: true, doNotFake: ["setInterval", "clearInterval"] });

    (itemUse as any).applyItemUsage(itemLightLifePotion, testCharacter.id);

    await wait(0.2);

    // extra call to make sure cycle is only running for 5 times
    jest.advanceTimersByTime(11000);
    await wait(0.2);

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, CharacterSocketEvents.ItemConsumed, {
      targetId: testCharacter._id,
      health: testCharacter.health + 20,
    });

    const character = (await Character.findById(testCharacter.id)) as unknown as ICharacter;
    expect(character.health).toBe(testCharacter.health + 20);
  });
});

function wait(sec): Promise<void> {
  return new Promise<void>((resolve) => {
    const inter = setInterval(() => {
      resolve();
      clearInterval(inter);
    }, sec * 1000);
  });
}
