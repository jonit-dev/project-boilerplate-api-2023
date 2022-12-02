import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { UseWithPickaxe } from "../UseWithPickaxe";
import { random } from "lodash";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemSocketEvents } from "@rpg-engine/shared";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";

jest.mock("lodash", () => ({
  ...jest.requireActual("lodash"),
  random: jest.fn(),
}));

describe("UseWithPickaxe.ts", () => {
  let useWithPickaxe: UseWithPickaxe, testCharacter: ICharacter;
  let mockLodashRandom: jest.Mock;
  const mockSendEventToUser = jest.fn();
  const mockSendAnimationEventToXYPosition = jest.fn();
  const mockAddItemToContainer = jest.fn();

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook();

    useWithPickaxe = container.get<UseWithPickaxe>(UseWithPickaxe);
    expect(useWithPickaxe).toBeDefined();

    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });

    jest
      .spyOn(AnimationEffect.prototype, "sendAnimationEventToXYPosition")
      .mockImplementation(mockSendAnimationEventToXYPosition);
    jest.spyOn(SocketMessaging.prototype, "sendEventToUser").mockImplementation(mockSendEventToUser);
    jest.spyOn(CharacterItemContainer.prototype, "addItemToContainer").mockImplementation(mockAddItemToContainer);

    mockLodashRandom = random as jest.Mock;
    mockLodashRandom.mockReset();
    mockSendAnimationEventToXYPosition.mockReset();
    mockSendEventToUser.mockReset();
    mockAddItemToContainer.mockReset();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });

  it("should sucess with a 30 percent change, add iron ingot to character backpack, and refresh character inventory", async () => {
    const mockAddIronToBackpack: jest.Mock = jest.fn().mockReturnValue(true);
    const mockRefreshInventory: jest.Mock = jest.fn();

    jest.spyOn(useWithPickaxe, "addIronToBackpack" as any).mockImplementation(mockAddIronToBackpack);
    jest.spyOn(useWithPickaxe, "refreshInventory" as any).mockImplementation(mockRefreshInventory);

    mockLodashRandom.mockReturnValue(50);
    await useWithPickaxe.execute(testCharacter, {} as any);
    expect(mockSendAnimationEventToXYPosition).toBeCalledTimes(1);

    expect(mockAddIronToBackpack).toBeCalledTimes(0);
    expect(mockRefreshInventory).toBeCalledTimes(0);

    mockLodashRandom.mockReturnValue(15);
    await useWithPickaxe.execute(testCharacter, {} as any);

    expect(mockSendAnimationEventToXYPosition).toBeCalledTimes(2);
    expect(mockAddIronToBackpack).toBeCalledTimes(1);
    expect(mockAddIronToBackpack).toBeCalledWith(testCharacter);
    expect(mockRefreshInventory).toBeCalledTimes(1);
    expect(mockRefreshInventory).toBeCalledWith(testCharacter);
  });

  it("should add iron to character backpack", async () => {
    // @ts-ignore
    await useWithPickaxe.addIronToBackpack(testCharacter);

    const characterInventory = await testCharacter.inventory;

    expect(mockAddItemToContainer).toBeCalledTimes(1);
    expect(mockAddItemToContainer).toBeCalledWith(
      expect.objectContaining({
        ...itemsBlueprintIndex[CraftingResourcesBlueprint.IronIngot],
        stackQty: 1,
      }),
      testCharacter,
      characterInventory.itemContainer
    );
  });

  it("should refresh character inventory", async () => {
    // @ts-ignore
    await useWithPickaxe.refreshInventory(testCharacter);

    expect(mockSendEventToUser).toBeCalledTimes(1);
    const callParams = mockSendEventToUser.mock.calls[0];
    expect(callParams[0]).toBe(testCharacter.channelId);
    expect(callParams[1]).toBe(ItemSocketEvents.EquipmentAndInventoryUpdate);
    expect(JSON.stringify(callParams[2].inventory.owner) === JSON.stringify(testCharacter.id)).toBe(true);
    expect(callParams[2]).toMatchObject({
      openEquipmentSetOnUpdate: false,
      openInventoryOnUpdate: true,
    });
  });
});
