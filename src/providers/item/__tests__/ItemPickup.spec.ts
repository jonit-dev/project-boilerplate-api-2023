/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemMock, stackableItemMock } from "@providers/unitTests/mock/itemMock";
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

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemPickup = container.get<ItemPickup>(ItemPickup);
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

  const pickupItem = async (toContainerId: string, extraProps?: Record<string, unknown>) => {
    const itemAdded = await itemPickup.performItemPickup(
      {
        itemId: testItem.id,
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
    const inventoryContainer = new ItemContainer({
      id: inventoryItemContainerId,
      parentItem: inventory.id,
    });
    inventoryContainer.slotQty = 1;
    inventoryContainer.slots = {
      0: testItem,
    };
    await inventoryContainer.save();

    const pickup = await pickupItem(inventoryContainer.id);
    expect(pickup).toBeFalsy();

    expect(sendCustomErrorMessage).toHaveBeenCalled();
    expect(sendCustomErrorMessage).toHaveBeenCalledWith(testCharacter, "Sorry, your inventory is full.");
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
    const secondAdd = await pickupItem(nonStackContainer.id);
    const thirdAdd = await pickupItem(nonStackContainer.id);

    expect(secondAdd).toBeTruthy();
    expect(thirdAdd).toBeTruthy();

    const updatedContainer = await ItemContainer.findById(nonStackContainer.id);

    expect(updatedContainer?.totalItemsQty).toBe(2);
  });

  it("should stack an item, if item isStackable", async () => {
    const stackableItem = new Item(stackableItemMock);
    await stackableItem.save();

    const stackContainer = new ItemContainer({
      id: inventoryItemContainerId,
      parentItem: inventory.id,
      slots: {
        0: stackableItem,
      },
      slotQty: 1,
    });

    await stackContainer.save();

    // remember, we already added a stackable item above!
    const secondAdd = await pickupItem(stackContainer.id, { itemId: stackableItem.id });
    const thirdAdd = await pickupItem(stackContainer.id, { itemId: stackableItem.id });

    expect(secondAdd).toBeTruthy();
    expect(thirdAdd).toBeTruthy();

    const updatedStackContainer = await ItemContainer.findById(stackContainer.id);

    expect(updatedStackContainer?.slots[0].stackQty).toBe(3);
    expect(updatedStackContainer?.slots[0].maxStackSize).toBe(10);
  });

  describe("Item pickup validation", () => {
    it("should throw an error if container is not accessible", async () => {
      const pickup = await pickupItem(inventoryItemContainerId, {
        itemId: "62b792030c3f470048781135", // inexistent item
      });
      expect(pickup).toBeFalsy();

      expect(sendCustomErrorMessage).toHaveBeenCalledWith(testCharacter, "Sorry, this item is not accessible.");
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
      testItem.x = testCharacter.x;
      testItem.y = testCharacter.y;
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

      expect(sendCustomErrorMessage).toHaveBeenCalledWith(
        testCharacter,
        "Sorry, you are banned and can't pick up this item."
      );

      testCharacter.isBanned = false;
      testCharacter.isOnline = false;
      await testCharacter.save();

      const pickup2 = await pickupItem(inventoryItemContainerId);
      expect(pickup2).toBeFalsy();

      expect(sendCustomErrorMessage).toHaveBeenCalledWith(
        testCharacter,
        "Sorry, you must be online to pick up this item."
      );
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
          "Sorry, you must have a bag or backpack to pick up this item."
        );
      } else {
        throw new Error("Failed to remove character equipment!");
      }
    });
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
