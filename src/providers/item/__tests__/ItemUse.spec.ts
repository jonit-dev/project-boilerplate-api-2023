import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { EquipmentEquip } from "@providers/equipment/EquipmentEquip";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { stackableItemMock } from "@providers/unitTests/mock/itemMock";
import { AnimationEffectKeys, CharacterSocketEvents, ItemSocketEvents, UISocketEvents } from "@rpg-engine/shared";
import { ItemUse } from "../ItemUse";
import { itemApple } from "../data/blueprints/foods/ItemApple";
import { itemLightLifePotion } from "../data/blueprints/potions/ItemLightLifePotion";
import { FoodsBlueprint } from "../data/types/itemsBlueprintTypes";
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
    expect(itemUsageMock).toBeCalledWith(itemApple, testCharacter.id);
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
      expect(sendEventToUser).toHaveBeenNthCalledWith(
        i,
        testCharacter.channelId,
        CharacterSocketEvents.AttributeChanged,
        {
          targetId: testCharacter._id,
          health: testCharacter.health + i,
          mana: testCharacter.mana + i,
        }
      );
    }

    expect(animationEventMock).toBeCalledTimes(5);

    const args = animationEventMock.mock.calls[0];
    expect(args[0].id).toBe(testCharacter.id);
    expect(args[1]).toBe(AnimationEffectKeys.LifeHeal);

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

  it("should fail if item does not have usable effect", async () => {
    const appleUsableEffect = itemApple.usableEffect;
    // @ts-ignore
    itemApple.usableEffect = null;

    const result = await itemUse.performItemUse({ itemId: testItem.id }, testCharacter);

    if (typeof appleUsableEffect !== "undefined") {
      itemApple.usableEffect = appleUsableEffect;
    }

    expect(result).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you cannot use this item.",
      type: "error",
    });
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
});

function wait(sec): Promise<void> {
  return new Promise<void>((resolve) => {
    const inter = setInterval(() => {
      resolve();
      clearInterval(inter);
    }, sec * 1000);
  });
}
