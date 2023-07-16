import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { container, unitTestHelper } from "@providers/inversify/container";
import { IItemMove } from "@rpg-engine/shared";
import { ItemDragAndDrop } from "../ItemDragAndDrop/ItemDragAndDrop";

describe("ItemDragAndDrop.ts", () => {
  let itemDragAndDrop: ItemDragAndDrop;
  let itemMoveData: IItemMove;
  let testCharacter: ICharacter;
  let testItem: IItem;
  let characterInventory: CharacterInventory;
  let sendErrorMessageToCharacterSpy: jest.SpyInstance;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;

  beforeAll(() => {
    itemDragAndDrop = container.get<ItemDragAndDrop>(ItemDragAndDrop);
    characterInventory = container.get<CharacterInventory>(CharacterInventory);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });
    testItem = await unitTestHelper.createMockItem();
    await testItem.save();

    inventory = (await characterInventory.getInventory(testCharacter)) as IItem;
    inventoryContainer = (await ItemContainer.findById(inventory?.itemContainer)) as IItemContainer;

    if (!inventory || !inventoryContainer) {
      throw new Error("Inventory or inventory container not found");
    }

    await unitTestHelper.addItemsToContainer(inventoryContainer, 1, [testItem]);

    // Add this part to create a valid itemMoveData object
    itemMoveData = {
      from: {
        item: testItem as any,
        slotIndex: 0,
        source: "Inventory",
        containerId: inventoryContainer._id,
      },
      to: {
        item: null,
        slotIndex: 1,
        source: "Inventory",
        containerId: inventoryContainer._id,
      },
      quantity: 1,
    };

    // @ts-ignore
    sendErrorMessageToCharacterSpy = jest.spyOn(itemDragAndDrop.socketMessaging, "sendErrorMessageToCharacter");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should move item in inventory", async () => {
    const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    expect(result).toBeTruthy();
  });

  it("should return false if item move is not valid", async () => {
    itemMoveData.from.containerId = "invalidContainerId"; // Change the containerId to make the move invalid
    const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    expect(result).toBeFalsy();
  });

  it("should return false if item to be moved is not found", async () => {
    await testItem.remove();

    const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    expect(result).toBeFalsy();

    expect(sendErrorMessageToCharacterSpy).toHaveBeenCalledTimes(1);
    expect(sendErrorMessageToCharacterSpy).toHaveBeenCalledWith(testCharacter, "Sorry, item to be moved wasn't found.");
  });

  it("should return false if items are moved between different sources", async () => {
    itemMoveData.to.source = "Equipment"; // Change the destination source to make the move invalid
    const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    expect(result).toBeFalsy();
  });

  it("should call isItemMoveValid method and moveItemInInventory", async () => {
    // @ts-ignore
    const isItemMoveValidSpy = jest.spyOn(itemDragAndDrop, "isItemMoveValid");
    // @ts-ignore
    const moveItemInInventorySpy = jest.spyOn(itemDragAndDrop, "moveItemInInventory");

    const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    expect(isItemMoveValidSpy).toHaveBeenCalledTimes(1);
    expect(moveItemInInventorySpy).toHaveBeenCalledTimes(1);
    expect(result).toBeTruthy();
  });

  it("should return false if the source and target slots are the same", async () => {
    itemMoveData.to.slotIndex = itemMoveData.from.slotIndex; // Set the destination slot index to be the same as the source
    const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    expect(result).toBeFalsy();
  });

  it("should return false if the target slot is occupied by a different item", async () => {
    const anotherTestItem = await unitTestHelper.createMockItem();
    await anotherTestItem.save();
    itemMoveData.to.item = anotherTestItem as any; // Change the item to a different item

    const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    expect(result).toBeFalsy();
  });

  it("should return false if the quantity to be moved is more than the available quantity", async () => {
    const stackableItem = await unitTestHelper.createStackableMockItem();

    const inventory = await characterInventory.getInventory(testCharacter);
    const inventoryContainer = await ItemContainer.findById(inventory?.itemContainer);

    if (!inventory || !inventoryContainer) {
      throw new Error("Inventory or inventory container not found");
    }

    await unitTestHelper.addItemsToContainer(inventoryContainer, 1, [stackableItem]);

    itemMoveData.from.item = stackableItem as any;
    itemMoveData.from.containerId = inventoryContainer._id;
    itemMoveData.from.slotIndex = 0;
    itemMoveData.to.item = null;
    itemMoveData.to.containerId = inventoryContainer._id;
    itemMoveData.to.slotIndex = 1;
    itemMoveData.quantity = 2;

    const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    expect(result).toBeFalsy();

    expect(sendErrorMessageToCharacterSpy).toHaveBeenCalledTimes(1);

    expect(sendErrorMessageToCharacterSpy).toHaveBeenCalledWith(
      testCharacter,
      "Sorry, you can't move more than the available quantity."
    );
  });

  it("when moving a stackable item, make sure to preserve its stackQty", async () => {
    const stackableItem = await unitTestHelper.createStackableMockItem();

    const beforeMoveStackQty = stackableItem.stackQty;

    const inventory = await characterInventory.getInventory(testCharacter);
    const inventoryContainer = await ItemContainer.findById(inventory?.itemContainer);

    if (!inventory || !inventoryContainer) {
      throw new Error("Inventory or inventory container not found");
    }

    await unitTestHelper.addItemsToContainer(inventoryContainer, 1, [stackableItem]);

    itemMoveData.from.item = stackableItem as any;
    itemMoveData.from.containerId = inventoryContainer._id;
    itemMoveData.from.slotIndex = 0;
    itemMoveData.to.item = null;
    itemMoveData.to.containerId = inventoryContainer._id;
    itemMoveData.to.slotIndex = 1;
    itemMoveData.quantity = 1;

    await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    const afterMoveStackQty = (await Item.findById(stackableItem._id))?.stackQty;

    expect(afterMoveStackQty).toEqual(beforeMoveStackQty);
  });

  describe("Drag and drop stackable items", () => {
    const setupDragAndDropItem = async (fromItem: IItem, quantity: number, toItem?: IItem): Promise<void> => {
      await unitTestHelper.addItemsToContainer(inventoryContainer, 10, [fromItem]);

      itemMoveData.from.item = fromItem as any;
      itemMoveData.from.containerId = inventoryContainer._id;
      itemMoveData.from.slotIndex = 0;
      // @ts-ignore
      itemMoveData.to.item = toItem ?? null;
      itemMoveData.to.containerId = inventoryContainer._id;
      itemMoveData.to.slotIndex = 1;
      itemMoveData.quantity = quantity;
    };

    it("when moving a stackable item with a quantity equal to the stackQty, it should move the whole stack", async () => {
      const stackableItem = await unitTestHelper.createStackableMockItem();

      await setupDragAndDropItem(stackableItem, stackableItem.stackQty!);

      const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

      // Update inventoryContainer to get the latest item states
      const updatedInventoryContainer = await ItemContainer.findById(inventory?.itemContainer);

      if (!updatedInventoryContainer) {
        throw new Error("Inventory container not found");
      }

      expect(result).toBeTruthy();

      expect(updatedInventoryContainer.slots[0]).toBeNull();
      expect(updatedInventoryContainer.slots[1]).toMatchObject(
        expect.objectContaining({
          _id: stackableItem._id,
          stackQty: stackableItem.stackQty,
        })
      );
    });

    it("when moving a stackable item with a quantity less than the current stackQty, a new stack should be created", async () => {
      const stackableItem = await unitTestHelper.createStackableMockItem({
        stackQty: 10,
      });

      await setupDragAndDropItem(stackableItem, stackableItem.stackQty! - 1);

      const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

      // Update inventoryContainer to get the latest item states
      const updatedInventoryContainer = await ItemContainer.findById(inventory?.itemContainer);

      if (!updatedInventoryContainer) {
        throw new Error("Inventory container not found");
      }

      expect(result).toBeTruthy();

      expect(updatedInventoryContainer.slots[0].stackQty).toEqual(1);
      expect(updatedInventoryContainer.slots[1]).toMatchObject({
        stackQty: stackableItem.stackQty! - 1,
      });
    });

    it("when moving the stackable item to a slot occupied by the same item, it should merge the stacks", async () => {
      const stackableItem = await unitTestHelper.createStackableMockItem({
        stackQty: 2,
      });
      const stackableItem2 = await unitTestHelper.createStackableMockItem({
        stackQty: 3,
      });

      await unitTestHelper.addItemsToContainer(inventoryContainer, 10, [stackableItem, stackableItem2]);

      itemMoveData = {
        from: {
          item: stackableItem as any,
          slotIndex: 0,
          source: "Inventory",
          containerId: inventoryContainer._id,
        },
        to: {
          item: stackableItem2 as any,
          slotIndex: 1,
          source: "Inventory",
          containerId: inventoryContainer._id,
        },
        quantity: stackableItem.stackQty!,
      };

      const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

      expect(result).toBeTruthy();
      // Update inventoryContainer to get the latest item states

      const updatedInventoryContainer = await ItemContainer.findById(inventory?.itemContainer);

      if (!updatedInventoryContainer) {
        throw new Error("Inventory container not found");
      }

      expect(updatedInventoryContainer.slots[0]).toBeNull();
      expect(updatedInventoryContainer.slots[1]).toMatchObject({
        stackQty: stackableItem.stackQty! + stackableItem2.stackQty!,
      });
    });
  });
});
