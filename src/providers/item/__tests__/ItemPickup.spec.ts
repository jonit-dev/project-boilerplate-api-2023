/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemMock } from "@providers/unitTests/mock/itemMock";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { Types } from "mongoose";
import { ItemPickup } from "../ItemPickup";

describe("ItemPickup.ts", () => {
  let itemPickup: ItemPickup;
  let testCharacter: ICharacter;
  let testItem: IItem;
  let inventory: IItem;
  let sendCustomErrorMessage: jest.SpyInstance;
  let inventoryItemContainerId: string;
  let characterWeight: CharacterWeight;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemPickup = container.get<ItemPickup>(ItemPickup);
    characterWeight = container.get<CharacterWeight>(CharacterWeight);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await (
      await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true, hasSkills: true })
    )
      .populate("skills")
      .execPopulate();
    testItem = await unitTestHelper.createMockItem();
    inventory = await testCharacter.inventory;
    inventoryItemContainerId = inventory.itemContainer as unknown as string;

    testCharacter.x = FromGridX(1);
    testCharacter.y = FromGridY(0);
    await testCharacter.save();
    await testItem.save();

    sendCustomErrorMessage = jest.spyOn(itemPickup, "sendCustomErrorMessage" as any);
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

    expect(item.x).toBeNull();
    expect(item.y).toBeNull();
    expect(item.scene).toBeNull();

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

  it("should block the item pickup, if the item is too heavy", async () => {
    const heavyItem = await unitTestHelper.createMockItem({
      weight: 999,
    });

    const pickupHeavyItem = await pickupItem(inventoryItemContainerId, {
      itemId: heavyItem.id,
    });

    expect(pickupHeavyItem).toBeFalsy();
    expect(sendCustomErrorMessage).toHaveBeenCalledWith(
      testCharacter,
      "Sorry, you are already carrying too much weight!"
    );
  });

  it("shouldn't add more items, if your inventory is full", async () => {
    const smallContainer = new ItemContainer({
      id: inventoryItemContainerId,
      parentItem: inventory.id,
    });
    smallContainer.slotQty = 1;
    smallContainer.slots = {
      0: testItem,
    };
    await smallContainer.save();

    const pickup = await pickupItem(smallContainer.id);
    expect(pickup).toBeFalsy();

    expect(sendCustomErrorMessage).toHaveBeenCalled();
    expect(sendCustomErrorMessage).toHaveBeenCalledWith(testCharacter, "Sorry, your container is full.");
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

  describe("Item pickup validation", () => {
    it("should throw an error if container is not accessible", async () => {
      const pickup = await pickupItem(inventoryItemContainerId, {
        itemId: "62b792030c3f470048781135", // inexistent item
      });
      expect(pickup).toBeFalsy();

      expect(sendCustomErrorMessage).toHaveBeenCalledWith(
        testCharacter,
        "Sorry, the item to be picked up was not found."
      );
    });

    it("should throw an error if you try to pickup an item that is not storable", async () => {
      const notStorableItem = new Item({
        ...itemMock,
        isStorable: false,
      });
      await notStorableItem.save();
      const pickup = await pickupItem(inventoryItemContainerId, {
        itemId: notStorableItem.id,
      });
      expect(pickup).toBeFalsy();
      expect(sendCustomErrorMessage).toHaveBeenCalledWith(testCharacter, "Sorry, you cannot store this item.");
    });

    it("should throw an error if item is too far away", async () => {
      const pickup = await pickupItem(inventoryItemContainerId, {
        x: FromGridX(999),
        y: FromGridY(999),
      });
      expect(pickup).toBeFalsy();

      expect(sendCustomErrorMessage).toHaveBeenCalledWith(
        testCharacter,
        "Sorry, you are too far away to pick up this item."
      );
    });

    it("should throw an error if user tries to pickup an item that he doesn't own", async () => {
      testItem.owner = "62b792030c3f470048781135" as unknown as Types.ObjectId; // inexistent character
      // to have an owner, an item must be in a container, not on the map!
      testItem.x = undefined;
      testItem.y = undefined;
      testItem.scene = undefined;
      await testItem.save();

      const pickup = await pickupItem(inventoryItemContainerId);
      expect(pickup).toBeFalsy();

      expect(sendCustomErrorMessage).toHaveBeenCalledWith(testCharacter, "Sorry, this item is not yours.");
    });

    it("should throw an error if the user tries to pickup an item and is banned or not online", async () => {
      testCharacter.isBanned = true;
      await testCharacter.save();

      const pickup = await pickupItem(inventoryItemContainerId);
      expect(pickup).toBeFalsy();

      testCharacter.isBanned = false;
      testCharacter.isOnline = false;
      await testCharacter.save();

      const pickup2 = await pickupItem(inventoryItemContainerId);
      expect(pickup2).toBeFalsy();
    });

    it("should throw an error if the user tries to pickup an item, without an inventory", async () => {
      const charEquip = await Equipment.findOne({ _id: testCharacter.equipment });

      if (charEquip) {
        charEquip.inventory = undefined;
        await charEquip.save();

        const pickup = await pickupItem(inventoryItemContainerId);
        expect(pickup).toBeFalsy();

        expect(sendCustomErrorMessage).toHaveBeenCalledWith(
          testCharacter,
          "Sorry, you need an inventory to pick this item."
        );
      } else {
        throw new Error("Failed to remove character equipment!");
      }
    });

    it("should throw an error if the character tries to pickup an item that's from another map", async () => {
      testItem.scene = "another-random-scene";
      await testItem.save();

      const pickup = await pickupItem(inventoryItemContainerId);
      expect(pickup).toBeFalsy();

      expect(sendCustomErrorMessage).toHaveBeenCalledWith(
        testCharacter,
        "Sorry, you can't pick up items from another map."
      );
    });
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
