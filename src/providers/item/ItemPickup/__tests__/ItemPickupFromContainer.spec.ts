/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { container, unitTestHelper } from "@providers/inversify/container";
import { IItemPickup } from "@rpg-engine/shared";
import { ItemPickupFromContainer } from "../ItemPickupFromContainer";

describe("ItemPickupFromContainer.ts ", () => {
  let itemPickupFromContainer: ItemPickupFromContainer;
  let itemPickupData: IItemPickup;
  let itemToBePicked: IItem;
  let inventory: IItem;
  let testItem1: IItem;
  let inventoryItemContainerId: string;
  let testCharacter: ICharacter;
  let itemContainer;
  let characterItemSlots: CharacterItemSlots;

  beforeAll(() => {
    itemPickupFromContainer = container.get<ItemPickupFromContainer>(ItemPickupFromContainer);
  });
  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasInventory: true, hasEquipment: true });
    inventory = await testCharacter.inventory;
    inventoryItemContainerId = inventory.itemContainer as unknown as string;
    itemToBePicked = await unitTestHelper.createMockItem();

    itemContainer = await ItemContainer.findById(inventoryItemContainerId);

    testItem1 = await unitTestHelper.createStackableMockItem();

    itemContainer.slots = [testItem1];

    await itemContainer.save();

    itemPickupData = {
      itemId: itemToBePicked.id,
      x: 10,
      y: 10,
      scene: "scene",
      toContainerId: "toContainerId",
      fromContainerId: itemContainer?.id,
    };

    characterItemSlots = {
      deleteItemOnSlot: jest.fn(),
    } as any;
  });
  afterEach(() => {
    // Create a mock function for the clearAllMocks function
    jest.clearAllMocks();
  });

  it("should return true if the item was successfully removed from the origin container", async () => {
    const result = await itemPickupFromContainer.pickupFromContainer(itemPickupData, testItem1, testCharacter);

    expect(result).toBe(true);
  });

  it("returns true if the item was successfully removed from the container", async () => {
    // @ts-expect-error
    characterItemSlots.deleteItemOnSlot.mockReturnValue(true);

    const fromContainer = (await ItemContainer.findById(itemPickupData.fromContainerId)) as unknown as IItemContainer;

    // @ts-expect-error
    const result = await itemPickupFromContainer.removeFromOriginContainer(testCharacter, fromContainer, testItem1);
    expect(result).toBe(true);
  });

  it("sends an error message to the character if the origin container is not found", async () => {
    // @ts-expect-error
    itemPickupFromContainer.socketMessaging = {
      sendErrorMessageToCharacter: jest.fn(),
    };
    const testItem2 = await unitTestHelper.createStackableMockItem();
    itemPickupData.fromContainerId = testItem2.id;

    // Call the pickupFromContainer method
    const result = await itemPickupFromContainer.pickupFromContainer(itemPickupData, testItem1, testCharacter);

    // Verify that the result is false
    expect(result).toBe(false);

    // Verify that the SocketMessaging.sendErrorMessageToCharacter method was called with the correct arguments
    // @ts-expect-error
    expect(itemPickupFromContainer.socketMessaging.sendErrorMessageToCharacter).toHaveBeenCalledWith(
      testCharacter,
      "Sorry, the origin container was not found."
    );
  });

  it("sends an error message to the character if the item could not be removed from the origin container", async () => {
    //  @ts-expect-error
    itemPickupFromContainer.socketMessaging = {
      sendErrorMessageToCharacter: jest.fn(),
    };
    //  @ts-expect-error
    itemPickupFromContainer.characterItemSlots = {
      deleteItemOnSlot: jest.fn(),
    };
    const testItem2 = await unitTestHelper.createStackableMockItem();

    await itemPickupFromContainer.pickupFromContainer(itemPickupData, testItem2, testCharacter);

    const fromContainer = (await ItemContainer.findById(itemPickupData.fromContainerId)) as unknown as IItemContainer;

    // @ts-expect-error
    expect(itemPickupFromContainer.characterItemSlots.deleteItemOnSlot).toHaveBeenCalledWith(
      fromContainer,
      testItem2._id
    );
    // @ts-expect-error
    expect(itemPickupFromContainer.socketMessaging.sendErrorMessageToCharacter).toHaveBeenCalledWith(
      testCharacter,
      "Sorry, failed to remove the item from the origin container."
    );
  });

  test("sends an error message to the character if the item could not be removed from the container", async () => {
    // @ts-expect-error
    characterItemSlots.deleteItemOnSlot.mockReturnValue(true);

    // @ts-expect-error
    itemPickupFromContainer.socketMessaging = {
      sendErrorMessageToCharacter: jest.fn(),
    };

    const fromContainer = (await ItemContainer.findById(itemPickupData.fromContainerId)) as unknown as IItemContainer;

    // @ts-expect-error
    await itemPickupFromContainer.removeFromOriginContainer(testCharacter, fromContainer, testItem1);

    // @ts-expect-error
    expect(itemPickupFromContainer.socketMessaging.sendErrorMessageToCharacter).toHaveBeenCalledWith(
      testCharacter,
      "Sorry, failed to remove the item from the origin container."
    );
  });
});
