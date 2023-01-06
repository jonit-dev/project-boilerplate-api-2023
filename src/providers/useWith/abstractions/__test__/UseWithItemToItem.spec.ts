import { container, unitTestHelper } from "@providers/inversify/container";
import { UseWithItemToItem } from "../UseWithItemToItem";
import random from "lodash/random";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemSocketEvents } from "@rpg-engine/shared";
import { recipeBread } from "@providers/useWith/recipes/foods/recipeBread";

jest.mock("lodash/random", () => jest.fn());

describe("UseWithItemToItem.ts", () => {
  let useWithItemToItem: UseWithItemToItem;

  let mockOriginItem: IItem;
  let mockTargetItem: IItem;
  let mockCharacter: ICharacter;

  const mockCheckItemInInventoryByKey = jest.fn();
  const mockSendErrorMessageToCharacter = jest.fn();
  const mockDecrementItemFromInventoryByKey = jest.fn();
  const mockSendAnimationEventToXYPosition = jest.fn();
  const mockSendAnimationEventToCharacter = jest.fn();
  const mockSendEventToUser = jest.fn();
  const mockAddItemToContainer = jest.fn();
  const mockRandom = random as jest.Mock;

  jest
    .spyOn(CharacterItemInventory.prototype, "checkItemInInventoryByKey")
    .mockImplementation(mockCheckItemInInventoryByKey);

  jest
    .spyOn(CharacterItemInventory.prototype, "decrementItemFromInventoryByKey")
    .mockImplementation(mockDecrementItemFromInventoryByKey);

  jest
    .spyOn(AnimationEffect.prototype, "sendAnimationEventToXYPosition")
    .mockImplementation(mockSendAnimationEventToXYPosition);

  jest
    .spyOn(AnimationEffect.prototype, "sendAnimationEventToCharacter")
    .mockImplementation(mockSendAnimationEventToCharacter);

  jest.spyOn(CharacterItemContainer.prototype, "addItemToContainer").mockImplementation(mockAddItemToContainer);
  jest.spyOn(SocketMessaging.prototype, "sendEventToUser").mockImplementation(mockSendEventToUser);
  jest
    .spyOn(SocketMessaging.prototype, "sendErrorMessageToCharacter")
    .mockImplementation(mockSendErrorMessageToCharacter);
  jest.spyOn(CharacterItemContainer.prototype, "addItemToContainer").mockImplementation(mockAddItemToContainer);

  function resetMocks(): void {
    mockCheckItemInInventoryByKey.mockReset();
    mockSendErrorMessageToCharacter.mockReset();
    mockDecrementItemFromInventoryByKey.mockReset();
    mockSendAnimationEventToXYPosition.mockReset();
    mockSendAnimationEventToCharacter.mockReset();
    mockSendEventToUser.mockReset();
    mockAddItemToContainer.mockReset();
  }

  const matchingItemsKeys = [CraftingResourcesBlueprint.Wheat, CraftingResourcesBlueprint.WaterBottle];

  const unMatchingItemsKeys = [CraftingResourcesBlueprint.Wheat, CraftingResourcesBlueprint.Bone];

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    useWithItemToItem = container.get<UseWithItemToItem>(UseWithItemToItem);

    mockOriginItem = await unitTestHelper.createMockItem();
    mockTargetItem = await unitTestHelper.createMockItem();
    mockCharacter = await unitTestHelper.createMockCharacter(null, { hasInventory: true, hasEquipment: true });
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook();
    resetMocks();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });

  it("should make sure origin and target items exists in the database, otherwise should not trigger any events ", async () => {
    mockCheckItemInInventoryByKey.mockReturnValue(false);
    await useWithItemToItem.execute(mockTargetItem, mockOriginItem, mockCharacter);

    expect(mockCheckItemInInventoryByKey).toBeCalledTimes(2);
    expect(mockCheckItemInInventoryByKey).toHaveBeenCalledWith(mockTargetItem.key, mockCharacter);
    expect(mockCheckItemInInventoryByKey).toHaveBeenCalledWith(mockOriginItem.key, mockCharacter);

    expect(mockSendErrorMessageToCharacter).toBeCalledTimes(1);
    expect(mockSendErrorMessageToCharacter).toBeCalledWith(
      mockCharacter,
      "You don't have the required items to perform this action."
    );

    expect(mockSendAnimationEventToCharacter).not.toBeCalled();
    expect(mockDecrementItemFromInventoryByKey).not.toBeCalled();
    expect(mockSendEventToUser).not.toBeCalled();
  });

  it("should fail if the target item and origin item doesnt have a matching recipe", async () => {
    mockTargetItem = await unitTestHelper.createMockItem({ key: unMatchingItemsKeys[0] });
    mockOriginItem = await unitTestHelper.createMockItem({ key: unMatchingItemsKeys[1] });
    resetMocks();
    mockCheckItemInInventoryByKey.mockReturnValue(true);
    await useWithItemToItem.execute(mockTargetItem, mockOriginItem, mockCharacter);

    expect(mockSendErrorMessageToCharacter).toBeCalledTimes(1);
    expect(mockSendErrorMessageToCharacter).toBeCalledWith(
      mockCharacter,
      "Sorry, the ingredients you have don't match any crafting recipe."
    );

    expect(mockSendAnimationEventToCharacter).not.toBeCalled();
    expect(mockDecrementItemFromInventoryByKey).not.toBeCalled();
    expect(mockSendEventToUser).not.toBeCalled();
  });

  it("should decrement the target item and origin item from character inventory", async () => {
    mockTargetItem = await unitTestHelper.createMockItem({ key: matchingItemsKeys[0], stackQty: 10 });
    mockOriginItem = await unitTestHelper.createMockItem({ key: matchingItemsKeys[1], stackQty: 10 });
    resetMocks();

    mockCheckItemInInventoryByKey.mockReturnValue(true);
    mockDecrementItemFromInventoryByKey.mockReturnValue(true);
    mockRandom.mockImplementation((p1, p2) => (p1 === 0 && p2 === 100 ? 99 : jest.requireActual("lodash/random")));
    await useWithItemToItem.execute(mockTargetItem, mockOriginItem, mockCharacter);

    expect(mockDecrementItemFromInventoryByKey).toBeCalledTimes(2);
    expect(mockDecrementItemFromInventoryByKey).toHaveBeenCalledWith(mockTargetItem.key, mockCharacter, 5);
    expect(mockDecrementItemFromInventoryByKey).toHaveBeenCalledWith(mockOriginItem.key, mockCharacter, 3);

    expect(mockSendErrorMessageToCharacter).toBeCalledTimes(1);
    expect(mockSendErrorMessageToCharacter).toBeCalledWith(mockCharacter, "Sorry, you failed to craft the item.");

    expect(mockSendAnimationEventToCharacter).toBeCalledTimes(1);
    expect(mockSendAnimationEventToCharacter).toBeCalledWith(mockCharacter, "miss");

    expect(mockSendEventToUser).toBeCalledTimes(1);
    const callParams = mockSendEventToUser.mock.calls[0];
    expect(callParams[0]).toBe(mockCharacter.channelId);
    expect(callParams[1]).toBe(ItemSocketEvents.EquipmentAndInventoryUpdate);
    expect(JSON.stringify(callParams[2].inventory.owner) === JSON.stringify(mockCharacter.id)).toBe(true);
    expect(callParams[2]).toMatchObject({
      openEquipmentSetOnUpdate: false,
      openInventoryOnUpdate: true,
    });
  });

  it("should created recipe output item to the character inventory", async () => {
    mockTargetItem = await unitTestHelper.createMockItem({ key: matchingItemsKeys[0], stackQty: 10 });
    mockOriginItem = await unitTestHelper.createMockItem({ key: matchingItemsKeys[1], stackQty: 10 });
    resetMocks();

    mockCheckItemInInventoryByKey.mockReturnValue(true);
    mockDecrementItemFromInventoryByKey.mockReturnValue(true);

    const output = recipeBread;
    mockRandom.mockImplementation((p1, p2) => {
      if (p1 === 0 && p2 === 100) {
        return 5;
      }

      if (p1 === output.outputQtyRange[0] && p2 === output.outputQtyRange[1]) return 4;
      return jest.requireActual("lodash/random");
    });

    await useWithItemToItem.execute(mockTargetItem, mockOriginItem, mockCharacter);

    expect(mockSendErrorMessageToCharacter).toBeCalledTimes(1);
    expect(mockSendErrorMessageToCharacter).toBeCalledWith(
      mockCharacter,
      "Sorry, failed to add crafting output to your inventory."
    );

    expect(mockAddItemToContainer).toBeCalledTimes(1);
    const mockparams = mockAddItemToContainer.mock.calls[0];
    const mockOutput = await unitTestHelper.createMockItemFromBlueprint(recipeBread.outputKey, { stackQty: 4 });
    expect(mockparams[0].key === mockOutput.key).toBe(true);
    expect(mockparams[0].stackQty === mockOutput.stackQty).toBe(true);
    expect(mockparams[1]).toBe(mockCharacter);
    expect(mockparams[2]).toStrictEqual((await mockCharacter.inventory).itemContainer);

    expect(mockSendEventToUser).not.toBeCalled();
    expect(mockSendAnimationEventToCharacter).not.toBeCalled();
    // test if addItemToContainer success
    mockTargetItem = await unitTestHelper.createMockItem({ key: matchingItemsKeys[0], stackQty: 10 });
    mockOriginItem = await unitTestHelper.createMockItem({ key: matchingItemsKeys[1], stackQty: 10 });
    resetMocks();

    mockCheckItemInInventoryByKey.mockReturnValue(true);
    mockDecrementItemFromInventoryByKey.mockReturnValue(true);

    mockRandom.mockImplementation((p1, p2) => {
      if (p1 === 0 && p2 === 100) {
        return 5;
      }

      if (p1 === output.outputQtyRange[0] && p2 === output.outputQtyRange[1]) return 4;
      return jest.requireActual("lodash/random");
    });

    mockAddItemToContainer.mockReturnValue(true);
    await useWithItemToItem.execute(mockTargetItem, mockOriginItem, mockCharacter, "effect key");

    expect(mockSendAnimationEventToCharacter).toBeCalledTimes(1);
    expect(mockSendAnimationEventToCharacter).toBeCalledWith(mockCharacter, "effect key");

    expect(mockSendErrorMessageToCharacter).not.toBeCalled();
    expect(mockSendEventToUser).toBeCalledTimes(1);
  });
});
