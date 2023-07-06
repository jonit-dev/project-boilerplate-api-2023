/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { FromGridX, FromGridY, IItemContainer } from "@rpg-engine/shared";
import { ContainersBlueprint } from "../../data/types/itemsBlueprintTypes";
import { ItemPickup } from "../ItemPickup";
import { ItemPickupUpdater } from "../ItemPickupUpdater";

describe("ItemPickup.ts", () => {
  let itemPickup: ItemPickup;
  let testCharacter: ICharacter;
  let testItem: IItem;
  let inventory: IItem;
  let inventoryItemContainerId: string;
  let characterWeight: CharacterWeight;
  let equipmentSlots: EquipmentSlots;
  let socketMessaging: SocketMessaging;
  let itemPickupUpdater: ItemPickupUpdater;

  beforeAll(() => {
    itemPickup = container.get<ItemPickup>(ItemPickup);
    characterWeight = container.get<CharacterWeight>(CharacterWeight);
    equipmentSlots = container.get<EquipmentSlots>(EquipmentSlots);
    socketMessaging = container.get<SocketMessaging>(SocketMessaging);
    itemPickupUpdater = container.get<ItemPickupUpdater>(ItemPickupUpdater);
  });

  beforeEach(async () => {
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

    await unitTestHelper.addItemsToContainer(newInventoryContainer, 10, [newItem]);

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

    const equipmentSet = await equipmentSlots.getEquipmentSlots(character._id, equipment._id);

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

  describe("Container messaging", () => {
    let sendEventToUserSpy: jest.SpyInstance;

    beforeEach(() => {
      sendEventToUserSpy = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("test sendEventToUser spy", () => {
      socketMessaging.sendEventToUser("123", "event", { data: "some data" }); // call the sendEventToUser method

      expect(sendEventToUserSpy).toHaveBeenCalled(); // verify that the sendEventToUser method was called
      expect(sendEventToUserSpy).toHaveBeenCalledWith("123", "event", { data: "some data" }); // verify that the method was
    });

    it("sends container read message for inventory container", async () => {
      const itemContainer = (await ItemContainer.findById(inventoryItemContainerId)) as unknown as IItemContainer;

      if (!itemContainer) {
        throw new Error("Failed to find item container");
      }

      await itemPickupUpdater.sendContainerRead(itemContainer, testCharacter);

      expect(sendEventToUserSpy).toHaveBeenCalled();
    });

    it("sends container read message with correct arguments", async () => {
      const itemContainer = await ItemContainer.findById(inventoryItemContainerId);
      // Call the sendContainerRead method
      // @ts-expect-error
      await itemPickupUpdater.sendContainerRead(itemContainer, testCharacter);

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

      const itemContainer = (await ItemContainer.findById(inventoryItemContainerId)) as unknown as IItemContainer;

      // @ts-expect-error
      await itemPickupUpdater.sendContainerRead(itemContainer, null);

      expect(sendEventToUserSpy).not.toHaveBeenCalled();

      // @ts-expect-error
      await itemPickupUpdater.sendContainerRead(null, testCharacter);

      expect(sendEventToUserSpy).not.toHaveBeenCalled();
    });
  });
});
