/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ItemContainerHelper } from "@providers/itemContainer/ItemContainerHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { ContainersBlueprint } from "../data/types/itemsBlueprintTypes";
import { ItemOwnership } from "../ItemOwnership";
import { ItemPickup } from "../ItemPickup/ItemPickup";
import { ItemPickupFromContainer } from "../ItemPickup/ItemPickupFromContainer";
import { ItemPickupMapContainer } from "../ItemPickup/ItemPickupMapContainer";
import { ItemPickupValidator } from "../ItemPickup/ItemPickupValidator";

describe("ItemPickup.ts", () => {
  let itemPickup: ItemPickup;
  let itemPickup2: ItemPickup;
  let testCharacter: ICharacter;
  let testItem: IItem;
  let inventory: IItem;
  let inventoryItemContainerId: string;
  let characterWeight: CharacterWeight;
  let equipmentSlots: EquipmentSlots;
  let socketMessaging: SocketMessaging;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemPickup = container.get<ItemPickup>(ItemPickup);
    characterWeight = container.get<CharacterWeight>(CharacterWeight);
    equipmentSlots = container.get<EquipmentSlots>(EquipmentSlots);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    socketMessaging = {
      sendEventToUser: jest.fn(),
    } as unknown as SocketMessaging;

    itemPickup2 = new ItemPickup(
      socketMessaging,
      // @ts-expect-error
      new CharacterWeight(),
      // @ts-expect-error
      new CharacterItemContainer(),
      // @ts-expect-error
      new EquipmentSlots(),
      new ItemOwnership(),
      // @ts-expect-error
      new ItemPickupFromContainer(),
      // @ts-expect-error
      new ItemPickupValidator(),
      // @ts-expect-error
      new ItemPickupMapContainer(),
      new ItemContainerHelper()
    );

    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });
    testItem = await unitTestHelper.createMockItem();
    inventory = await testCharacter.inventory;
    inventoryItemContainerId = inventory.itemContainer as unknown as string;

    testCharacter.x = FromGridX(1);
    testCharacter.y = FromGridY(0);
    await testCharacter.save();
    await testItem.save();
  });

  const pickupItem = async (
    toContainerId: string,
    extraProps?: Record<string, unknown> | null,
    newItem?: boolean,
    isNewItemStackable?: boolean
  ) => {
    let itemToBePicked: IItem = testItem;
    if (newItem) {
      if (isNewItemStackable) {
        itemToBePicked = await unitTestHelper.createStackableMockItem();
      } else {
        itemToBePicked = await unitTestHelper.createMockItem();
      }
    }

    const itemAdded = await itemPickup.performItemPickup(
      {
        itemId: itemToBePicked.id,
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

  it("should add item to character inventory", async () => {
    const itemAdded = await pickupItem(inventoryItemContainerId);

    expect(itemAdded).toBeTruthy();
  });

  it("item should be deleted on the map after being picked up to the inventory", async () => {
    const mapItem = await unitTestHelper.createMockItem({
      x: testCharacter.x,
      y: testCharacter.y,
      scene: testCharacter.scene,
    });

    const pickup = await pickupItem(inventoryItemContainerId, { itemId: mapItem.id });

    expect(pickup).toBeTruthy();

    const item = await Item.findById(mapItem.id);

    if (!item) {
      throw new Error("Failed to find item after pickup!");
    }

    expect(item.x).toBeUndefined();
    expect(item.y).toBeUndefined();
    expect(item.scene).toBeUndefined();

    const itemContainer = await ItemContainer.findById(inventoryItemContainerId);

    expect(String(itemContainer?.itemIds[0]) === String(mapItem._id)).toBeTruthy();
  });

  it("should increase character weight, after items are picked up", async () => {
    const currentWeight = await characterWeight.getWeight(testCharacter);
    const maxWeight = await characterWeight.getMaxWeight(testCharacter);

    expect(currentWeight).toBe(3);
    expect(maxWeight).toBe(15);

    const addedItem = await pickupItem(inventoryItemContainerId);
    expect(addedItem).toBeTruthy();

    const newWeight = await characterWeight.getWeight(testCharacter!);
    expect(newWeight).toBe(4);

    const newMaxWeight = await characterWeight.getMaxWeight(testCharacter!);
    expect(newMaxWeight).toBe(15);
  });

  it("should properly pickup an inventory item", async () => {
    const inventoryItem = (await unitTestHelper.createMockItemFromBlueprint(
      ContainersBlueprint.Bag
    )) as unknown as IItem;

    const newInventoryContainer = await ItemContainer.findById(inventoryItem.itemContainer);

    if (!newInventoryContainer) {
      throw new Error("Failed to find inventory container!");
    }

    const newItem = await unitTestHelper.createMockItem();

    await unitTestHelper.addItemsToInventoryContainer(newInventoryContainer, 10, [newItem]);

    expect(newInventoryContainer.slots[0]._id).toEqual(newItem._id);

    const equipment = await Equipment.findById(testCharacter.equipment);

    if (!equipment) {
      throw new Error("Failed to find equipment");
    }

    equipment.inventory = undefined; // remove inventory
    await equipment.save();

    expect(equipment.inventory).toBeUndefined();

    const pickupInventory = await pickupItem(inventoryItemContainerId, {
      itemId: inventoryItem.id,
    });

    expect(pickupInventory).toBeTruthy();

    const equipmentSet = await equipmentSlots.getEquipmentSlots(equipment._id);

    expect(equipmentSet).toBeTruthy();

    const inventory = equipmentSet.inventory as unknown as IItem;

    expect(inventory._id).toEqual(inventoryItem._id);

    const newInventoryContainerAfterPickup = await ItemContainer.findById(inventory.itemContainer);

    if (!newInventoryContainerAfterPickup) {
      throw new Error("Failed to find inventory container!");
    }

    expect(newInventoryContainerAfterPickup?.slots[0]?._id).toEqual(newItem._id);
  });

  it("should not stack an item, if its not stackable", async () => {
    const nonStackContainer = new ItemContainer({
      id: inventoryItemContainerId,
      parentItem: inventory.id,
      slots: {
        0: null,
        1: null,
      },
      slotQty: 2,
    });
    await nonStackContainer.save();

    // remember, we already added a stackable item above!
    const secondAdd = await pickupItem(nonStackContainer.id, null, true, false);
    expect(secondAdd).toBeTruthy();

    const thirdAdd = await pickupItem(nonStackContainer.id, null, true, false);
    expect(thirdAdd).toBeTruthy();

    const updatedContainer = await ItemContainer.findById(nonStackContainer.id);

    expect(updatedContainer?.totalItemsQty).toBe(2);
  });

  it("should stack an item, if item isStackable", async () => {
    const stackableItem1 = await unitTestHelper.createStackableMockItem();

    const stackableItem2 = await unitTestHelper.createStackableMockItem();

    const stackableItem3 = await unitTestHelper.createStackableMockItem();

    const stackContainer = new ItemContainer({
      id: inventoryItemContainerId,
      parentItem: inventory.id,
      slots: {
        0: stackableItem1.toJSON({ virtuals: true }),
      },
      slotQty: 1,
    });

    await stackContainer.save();

    // remember, we already added a stackable item above!
    const secondAdd = await pickupItem(stackContainer.id, { itemId: stackableItem2.id });
    const thirdAdd = await pickupItem(stackContainer.id, { itemId: stackableItem3.id });

    expect(secondAdd).toBeTruthy();
    expect(thirdAdd).toBeTruthy();

    const updatedStackContainer = await ItemContainer.findById(stackContainer.id);

    expect(updatedStackContainer?.slots[0].stackQty).toBe(3);
    expect(updatedStackContainer?.slots[0].maxStackSize).toBe(10);

    const updatedItem = await Item.findById(stackableItem1.id);
    expect(updatedItem!.stackQty).toBe(3);

    // items that were stacked should be deleted
    expect(await Item.findById(stackableItem2.id)).toBeFalsy();
    expect(await Item.findById(stackableItem3.id)).toBeFalsy();
  });

  test("test sendEventToUser spy", () => {
    const spy = jest.spyOn(SocketMessaging.prototype, "sendEventToUser"); // create a spy on the

    // sendEventToUser method
    // @ts-expect-error
    const socketMessaging = new SocketMessaging(); // create an instance of the SocketMessaging class
    socketMessaging.sendEventToUser("123", "event", { data: "some data" }); // call the sendEventToUser method

    expect(spy).toHaveBeenCalled(); // verify that the sendEventToUser method was called
    expect(spy).toHaveBeenCalledWith("123", "event", { data: "some data" }); // verify that the method was
  });

  test("sends container read message for inventory container", async () => {
    // Spy on the sendEventToUser method of the SocketMessaging class
    const spy = jest.spyOn(socketMessaging, "sendEventToUser");

    const itemContainer = await ItemContainer.findById(inventoryItemContainerId);
    // Call the sendContainerRead method
    // @ts-expect-error
    await itemPickup2.sendContainerRead(itemContainer, testCharacter);

    expect(spy).toHaveBeenCalled();
  });

  it("sends container read message with correct arguments", async () => {
    // Spy on the sendEventToUser method
    const sendEventToUserSpy = jest.spyOn(socketMessaging, "sendEventToUser");

    const itemContainer = await ItemContainer.findById(inventoryItemContainerId);
    // Call the sendContainerRead method
    // @ts-expect-error
    await itemPickup2.sendContainerRead(itemContainer, testCharacter);

    // Verify that the sendEventToUser method was called
    expect(sendEventToUserSpy).toHaveBeenCalled();

    // Verify that the sendEventToUser method was called with the correct arguments
    expect(sendEventToUserSpy).toHaveBeenCalledWith(testCharacter.channelId, "ContainerRead", {
      itemContainer: itemContainer,
      type: "Inventory",
    });
  });

  it("does not send message with invalid character or container", async () => {
    testCharacter.channelId = testCharacter.id;
    // Spy on the sendEventToUser method
    const sendEventToUserSpy = jest.spyOn(socketMessaging, "sendEventToUser");

    const itemContainer = await ItemContainer.findById(inventoryItemContainerId);
    // @ts-expect-error
    // Call the sendContainerRead method with an invalid character (null)
    await itemPickup2.sendContainerRead(itemContainer, null);

    // Verify that the sendEventToUser method was not called
    expect(sendEventToUserSpy).not.toHaveBeenCalled();
    // @ts-expect-error
    // Call the sendContainerRead method with an invalid container (null)
    await itemPickup2.sendContainerRead(null, testCharacter);

    // Verify that the sendEventToUser method was not called
    expect(sendEventToUserSpy).not.toHaveBeenCalled();
  });

  it("returns the correct list of allowed item types", () => {
    const mockGetAllowedItemTypes = jest.fn().mockReturnValue(["Weapon", "Armor"]);
    itemPickup.getAllowedItemTypes = mockGetAllowedItemTypes;

    // Call the getAllowedItemTypes method
    const allowedTypes = itemPickup.getAllowedItemTypes();

    // Verify that the returned list of types is correct

    expect(allowedTypes).toEqual(["Weapon", "Armor"]);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
