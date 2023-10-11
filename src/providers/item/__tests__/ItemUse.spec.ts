import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { EquipmentEquip } from "@providers/equipment/EquipmentEquip";
import { blueprintManager, container, unitTestHelper } from "@providers/inversify/container";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { stackableItemMock } from "@providers/unitTests/mock/itemMock";
import {
  AnimationEffectKeys,
  CharacterSocketEvents,
  IConsumableItemBlueprint,
  ItemRarities,
  ItemSocketEvents,
} from "@rpg-engine/shared";
import { ItemUse } from "../ItemUse";
import { FoodsBlueprint, PotionsBlueprint } from "../data/types/itemsBlueprintTypes";
import { ItemValidation } from "../validation/ItemValidation";

describe("ItemUse.ts", () => {
  let itemUse: ItemUse;
  let testCharacter: ICharacter;
  let testItem: IItem;
  let inventory: IItem;
  let inventoryItemContainerId: string;
  let sendEventToUser: jest.SpyInstance;
  let itemUsageMock: jest.SpyInstance;
  let equipmentEquip: EquipmentEquip;
  let animationEventMock: jest.SpyInstance;

  let canApplyItemUsageMock: jest.SpyInstance;

  beforeAll(() => {
    itemUse = container.get<ItemUse>(ItemUse);
    equipmentEquip = container.get<EquipmentEquip>(EquipmentEquip);
  });

  beforeEach(async () => {
    testCharacter = await (
      await unitTestHelper.createMockCharacter(
        { health: 50, mana: 50 },
        { hasEquipment: true, hasInventory: true, hasSkills: true }
      )
    )
      .populate("skills")
      .execPopulate();

    testItem = await unitTestHelper.createMockItemFromBlueprint(FoodsBlueprint.Apple, {
      stackQty: 2,
    });

    inventory = await testCharacter.inventory;
    inventoryItemContainerId = inventory.itemContainer as unknown as string;
    await addItemToInventory(testItem, 0);

    await testCharacter.save();

    sendEventToUser = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");

    animationEventMock = jest.spyOn(AnimationEffect.prototype, "sendAnimationEventToCharacter");
    animationEventMock.mockImplementation();

    canApplyItemUsageMock = jest.spyOn(itemUse, "canApplyItemUsage" as any).mockImplementation(() => true);

    itemUsageMock = jest.spyOn(itemUse as any, "applyItemUsage");
    itemUsageMock.mockImplementation();
  });

  afterEach(() => {
    sendEventToUser.mockRestore();
    itemUsageMock.mockRestore();
    animationEventMock.mockRestore();
    jest.clearAllMocks();
  });

  const getInventoryContainer = async (): Promise<IItemContainer> => {
    return (await ItemContainer.findById(inventoryItemContainerId)) as unknown as IItemContainer;
  };

  const getInventoryItem = async (index: number): Promise<IItem> => {
    const container = await getInventoryContainer();
    return container.slots[index];
  };

  const addItemToInventory = async (item: IItem, index: number): Promise<IItem> => {
    const bag = await getInventoryContainer();
    if (bag) {
      bag.slots[index] = item;
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
    await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);

    expect(itemUsageMock).toBeCalledTimes(1);
    expect(itemUsageMock).toBeCalledWith(
      expect.objectContaining({
        key: testItem.key,
      }),

      testCharacter.id
    );
  });

  it("should decrement item from inventory, after item is consumed", async () => {
    let item = await getInventoryItem(0);
    expect(item.stackQty).toBe(2);

    await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);

    item = await getInventoryItem(0);
    expect(item.stackQty).toBe(1);

    await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);

    item = await getInventoryItem(0);
    expect(item).toBeNull();
  });

  it("should decrement original item, after item is consumed", async () => {
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

    expect(sendEventToUser).toBeCalledTimes(2);

    const inventoryContainer = await getInventoryContainer();

    expect(sendEventToUser).toBeCalledWith(testCharacter.channelId, ItemSocketEvents.EquipmentAndInventoryUpdate, {
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
      openInventoryOnUpdate: false,
    });
  });

  it("should increase character health instantly for potions", async () => {
    itemUsageMock.mockRestore();
    jest.useFakeTimers({ advanceTimers: true, doNotFake: ["setInterval", "clearInterval"] });

    const itemLightLifePotionBlueprint = await blueprintManager.getBlueprint<IConsumableItemBlueprint>(
      "items",
      PotionsBlueprint.LightLifePotion
    );

    (itemUse as any).applyItemUsage(itemLightLifePotionBlueprint, testCharacter.id);

    await wait(0.2);

    // extra call to make sure cycle is only running for 5 times
    jest.advanceTimersByTime(11000);
    await wait(0.2);

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, CharacterSocketEvents.AttributeChanged, {
      targetId: testCharacter._id,
      health: 60,
      mana: testCharacter.mana,
    });

    expect(animationEventMock).toBeCalledTimes(1);

    const args = animationEventMock.mock.calls[0];
    expect(args[0].id).toBe(testCharacter.id);
    expect(args[1]).toBe(AnimationEffectKeys.LifeHeal);

    const character = (await Character.findById(testCharacter.id)) as unknown as ICharacter;
    expect(character.health).toBe(60);
  });

  it("should call character validation", async () => {
    const characterValidationMock = jest.spyOn(CharacterValidation.prototype, "hasBasicValidation");
    characterValidationMock.mockReturnValue(false);

    let result = await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);
    expect(result).toBeFalsy();

    expect(characterValidationMock).toHaveBeenLastCalledWith(testCharacter);

    characterValidationMock.mockReset();
    characterValidationMock.mockReturnValue(true);

    result = await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);
    expect(result).toBeTruthy();

    characterValidationMock.mockRestore();
  });

  it("should call item validation", async () => {
    const itemValidationMock = jest.spyOn(ItemValidation.prototype, "isItemInCharacterInventory");
    itemValidationMock.mockReturnValue(Promise.resolve(false));

    let result = await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);
    expect(result).toBeFalsy();

    expect(itemValidationMock).toHaveBeenLastCalledWith(testCharacter, testItem.id);

    itemValidationMock.mockReset();
    itemValidationMock.mockReturnValue(Promise.resolve(true));

    result = await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);
    expect(result).toBeTruthy();

    itemValidationMock.mockRestore();
  });

  it("should decrement correct quantity if item has multiple stacks", async () => {
    const testItem2 = new Item(stackableItemMock);
    testItem2.stackQty = 4;
    await testItem2.save();

    await addItemToInventory(testItem2, 1);

    await itemUse.performItemUse({ itemId: testItem2.id }, testCharacter);

    const item1 = await getInventoryItem(0);
    expect(item1.stackQty).toBe(1);

    const item2 = await getInventoryItem(1);
    expect(item2.stackQty).toBe(4);
  });

  it("should call applyItemUsage with healthRecovery if the item is of subtype Food and has healthRecovery", async () => {
    testItem.healthRecovery = 10;
    await testItem.save();

    // @ts-ignore
    const applyItemUsageMock = jest.spyOn(itemUse as any, "applyItemUsage");

    const result = await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);
    expect(result).toBeTruthy();

    // Check if applyItemUsage was called with healthRecovery
    expect(applyItemUsageMock).toHaveBeenCalledWith(expect.any(Object), testCharacter.id, testItem.healthRecovery);

    applyItemUsageMock.mockRestore();
  });

  it("should decrement item with same rarity", async () => {
    let item = (await Item.findById(testItem.id)) as unknown as IItem;
    expect(item.stackQty).toBe(2);

    const testItem2 = await unitTestHelper.createMockItemFromBlueprint(FoodsBlueprint.Apple, {
      stackQty: 4,
      rarity: ItemRarities.Epic,
    });

    await addItemToInventory(testItem2, 1);

    await itemUse.performItemUse({ itemId: testItem2.id }, testCharacter);

    item = (await Item.findById(testItem.id)) as unknown as IItem;
    expect(item.stackQty).toBe(2);

    const item2 = (await Item.findById(testItem2.id)) as unknown as IItem;
    expect(item2.stackQty).toBe(3);
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
