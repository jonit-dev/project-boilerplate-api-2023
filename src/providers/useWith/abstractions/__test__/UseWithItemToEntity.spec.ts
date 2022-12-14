import { container, unitTestHelper } from "@providers/inversify/container";
import random from "lodash/random";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemSocketEvents, MapLayers } from "@rpg-engine/shared";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { UseWithItemToEntity, IUseWithItemToEntityOptions } from "../UseWithItemToEntity";

jest.mock("lodash/random", () => jest.fn());

describe("UseWithItemToEntity.ts", () => {
  let useWithItemToTile: UseWithItemToEntity;
  let mockCharacter: ICharacter;
  const baseOptions: IUseWithItemToEntityOptions = {
    rewards: [
      {
        chance: 20,
        key: CraftingResourcesBlueprint.IronOre,
        qty: [0, 3],
      },
      {
        chance: 10,
        key: CraftingResourcesBlueprint.GoldenOre,
        qty: 3,
      },
    ],
    targetEntity: {
      layer: MapLayers.Ground,
      x: 32,
      y: 45,
    } as any,
    errorAnimationEffectKey: "errorEffectKey",
    errorMessages: ["error1", "error2", "error3"],
    successAnimationEffectKey: "successEffectKey",
    targetEntityAnimationEffectKey: "targetTileEffectKey",
    successMessages: ["success1", "success2", "success3"],
    requiredResource: {
      key: CraftingResourcesBlueprint.WaterBottle,
      decrementQty: 1,
      errorMessage: "you need to stay hydrated",
    },
  };

  const mockCheckItemInInventory = jest.fn();
  const mockSendErrorMessageToCharacter = jest.fn();
  const mockDecrementItemFromInventory = jest.fn();
  const mockSendAnimationEventToXYPosition = jest.fn();
  const mockSendAnimationEventToCharacter = jest.fn();
  const mockSendEventToUser = jest.fn();
  const mockAddItemToContainer = jest.fn();
  const mockRandom = random as jest.Mock;

  jest
    .spyOn(CharacterItemInventory.prototype, "checkItemInInventoryByKey")
    .mockImplementation(mockCheckItemInInventory);

  jest
    .spyOn(CharacterItemInventory.prototype, "decrementItemFromInventory")
    .mockImplementation(mockDecrementItemFromInventory);

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

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook();

    useWithItemToTile = container.get<UseWithItemToEntity>(UseWithItemToEntity);
    mockCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });

    resetMocks();
  });

  function resetMocks(): void {
    mockCheckItemInInventory.mockReset();
    mockSendErrorMessageToCharacter.mockReset();
    mockDecrementItemFromInventory.mockReset();
    mockSendAnimationEventToXYPosition.mockReset();
    mockSendAnimationEventToCharacter.mockReset();
    mockSendEventToUser.mockReset();
    mockAddItemToContainer.mockReset();
  }

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });

  it("should make sure the character has the required items", async () => {
    mockCheckItemInInventory.mockResolvedValueOnce(false);

    await useWithItemToTile.execute(mockCharacter, baseOptions);
    expect(mockCheckItemInInventory).toBeCalledTimes(1);
    expect(mockCheckItemInInventory).toBeCalledWith(baseOptions.requiredResource?.key, mockCharacter);

    expect(mockSendErrorMessageToCharacter).toBeCalledTimes(1);
    expect(mockSendErrorMessageToCharacter).toBeCalledWith(mockCharacter, baseOptions.requiredResource?.errorMessage);

    expect(mockDecrementItemFromInventory).not.toBeCalled();
    expect(mockAddItemToContainer).not.toBeCalled();
    expect(mockSendAnimationEventToXYPosition).not.toBeCalled();
    expect(mockSendAnimationEventToCharacter).not.toBeCalled();
    expect(mockSendEventToUser).not.toBeCalled();
  });

  it("should decrement required resource and send the correct events", async () => {
    mockCheckItemInInventory.mockResolvedValueOnce(true);

    mockDecrementItemFromInventory.mockReturnValueOnce(false);

    await useWithItemToTile.execute(mockCharacter, baseOptions);

    expect(mockSendErrorMessageToCharacter).toBeCalledTimes(1);
    expect(mockSendErrorMessageToCharacter).toBeCalledWith(mockCharacter);

    resetMocks();

    mockCheckItemInInventory.mockResolvedValueOnce(true);

    mockDecrementItemFromInventory.mockReturnValue(true);
    mockRandom.mockImplementation((from, to) => {
      if (from === 0 && to === 100) return 50;
      if (from === 0 && to === 2) return 1;

      const random = jest.requireActual("lodash").random;
      return random(from, to);
    });
    await useWithItemToTile.execute(mockCharacter, baseOptions);

    expect(mockDecrementItemFromInventory).toBeCalledWith(
      baseOptions.requiredResource?.key,
      mockCharacter,
      baseOptions.requiredResource?.decrementQty
    );

    expect(mockSendAnimationEventToXYPosition).toBeCalledWith(
      mockCharacter,
      baseOptions.targetEntityAnimationEffectKey,
      baseOptions.targetEntity.x,
      baseOptions.targetEntity.y
    );

    expect(mockSendErrorMessageToCharacter).toBeCalledTimes(1);
    expect(mockSendErrorMessageToCharacter).toBeCalledWith(mockCharacter, baseOptions.errorMessages?.at(1));

    expect(mockSendAnimationEventToCharacter).toBeCalledTimes(1);
    expect(mockSendAnimationEventToCharacter).toBeCalledWith(mockCharacter, baseOptions.errorAnimationEffectKey);

    expect(mockAddItemToContainer).not.toBeCalled();

    expect(mockSendEventToUser).not.toBeCalled();
  });

  it("should add item to character inventory send the correct events", async () => {
    mockCheckItemInInventory.mockResolvedValueOnce(true);
    mockDecrementItemFromInventory.mockReturnValue(true);
    mockAddItemToContainer.mockReturnValue(true);

    mockRandom.mockImplementation((from, to) => {
      if (from === 0 && to === 100) return 19;
      if (from === 0 && to === 2) return 1;

      const random = jest.requireActual("lodash").random;
      return random(from, to);
    });
    await useWithItemToTile.execute(mockCharacter, baseOptions);

    expect(mockDecrementItemFromInventory).toBeCalledWith(
      baseOptions.requiredResource?.key,
      mockCharacter,
      baseOptions.requiredResource?.decrementQty
    );

    expect(mockSendAnimationEventToXYPosition).toBeCalledWith(
      mockCharacter,
      baseOptions.targetEntityAnimationEffectKey,
      baseOptions.targetEntity.x,
      baseOptions.targetEntity.y
    );

    expect(mockSendErrorMessageToCharacter).toBeCalledTimes(1);
    expect(mockSendErrorMessageToCharacter).toBeCalledWith(mockCharacter, baseOptions.successMessages?.at(1));

    expect(mockSendAnimationEventToCharacter).toBeCalledTimes(1);
    expect(mockSendAnimationEventToCharacter).toBeCalledWith(mockCharacter, baseOptions.successAnimationEffectKey);

    expect(mockAddItemToContainer).toBeCalledTimes(1);

    const itemCallParams = mockAddItemToContainer.mock.calls[0];
    expect(itemCallParams[0].key).toBe(CraftingResourcesBlueprint.IronOre);
    expect(itemCallParams[1]).toBe(mockCharacter);
    expect(JSON.stringify(itemCallParams[2]) === JSON.stringify((await mockCharacter.inventory).itemContainer)).toBe(
      true
    );

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

  it("should add rewards sorted from rare to common", async () => {
    const mockGetRandomRewardChance = jest.fn();
    mockGetRandomRewardChance.mockReturnValueOnce(9);

    mockCheckItemInInventory.mockResolvedValueOnce(true);
    mockDecrementItemFromInventory.mockReturnValue(true);
    mockAddItemToContainer.mockReturnValue(true);

    mockRandom.mockImplementation((from, to) => {
      if (from === 0 && to === 100) return mockGetRandomRewardChance();

      const random = jest.requireActual("lodash").random;
      return random(from, to);
    });
    await useWithItemToTile.execute(mockCharacter, baseOptions);

    expect(mockAddItemToContainer).toBeCalled();
    let callParam = mockAddItemToContainer.mock.calls[0];
    expect(callParam[0].key).toBe(CraftingResourcesBlueprint.GoldenOre);
    expect(callParam[0].stackQty).toBe(3);

    resetMocks();

    mockGetRandomRewardChance.mockReturnValueOnce(16);

    mockCheckItemInInventory.mockResolvedValueOnce(true);
    mockDecrementItemFromInventory.mockReturnValue(true);
    mockAddItemToContainer.mockReturnValue(true);

    mockRandom.mockImplementation((from, to) => {
      if (from === 0 && to === 100) return mockGetRandomRewardChance();
      if (from === 0 && to === 3) return 2;

      const random = jest.requireActual("lodash").random;
      return random(from, to);
    });
    await useWithItemToTile.execute(mockCharacter, baseOptions);

    expect(mockAddItemToContainer).toBeCalled();
    callParam = mockAddItemToContainer.mock.calls[0];
    expect(callParam[0].key).toBe(CraftingResourcesBlueprint.IronOre);
    expect(callParam[0].stackQty).toBe(2);
  });
});
