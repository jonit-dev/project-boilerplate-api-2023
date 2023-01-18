import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { IItemMove } from "@rpg-engine/shared";
import { ItemDragAndDrop } from "../ItemDragAndDrop";

describe("ItemDragAndDrop.ts", () => {
  let itemDragAndDrop: ItemDragAndDrop;
  let itemMoveData: IItemMove;
  let testCharacter: ICharacter;
  let testItem: IItem;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    itemDragAndDrop = container.get<ItemDragAndDrop>(ItemDragAndDrop);

    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });
    testItem = await unitTestHelper.createMockItem();
    await testItem.save();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    itemMoveData = {
      from: {
        containerId: "containerId",
        source: "Inventory",
        slotIndex: 0,
        item: testItem as any,
      },
      to: {
        containerId: "containerId",
        slotIndex: 1,
        source: "Inventory",
        item: null,
      },
      quantity: 1,
    };
    jest.spyOn(Item, "findById").mockResolvedValue(null);
    // @ts-expect-error
    jest.spyOn(ItemContainer, "findById").mockResolvedValue({ _id: "containerId", items: [{ _id: testItem._id }] });
    // @ts-expect-error
    jest.spyOn(itemDragAndDrop, "sendRefreshItemsEvent").mockReturnValue();
    // @ts-expect-error
    jest.spyOn(itemDragAndDrop, "isItemMoveValid").mockResolvedValue(true);
    // @ts-expect-error
    jest.spyOn(itemDragAndDrop.socketMessaging, "sendErrorMessageToCharacter").mockReturnValue();
  });

  it("should move item in inventory", async () => {
    const itemToBeMoved = { _id: testItem._id } as any;
    const itemContainer = { _id: "containerId", items: [{ _id: testItem._id }] } as any;
    jest.spyOn(Item, "findById").mockResolvedValue(itemToBeMoved);
    jest.spyOn(ItemContainer, "findById").mockResolvedValue(itemContainer);

    const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    expect(result).toBe(true);
    // @ts-expect-error
    expect(itemDragAndDrop.isItemMoveValid).toHaveBeenCalledWith(itemMoveData, testCharacter);
    // @ts-expect-error
    expect(itemDragAndDrop.sendRefreshItemsEvent).toHaveBeenCalled();
  });

  it("should return false if item move is not valid", async () => {
    // @ts-expect-error
    jest.spyOn(itemDragAndDrop, "isItemMoveValid").mockResolvedValue(false);

    // call the method
    const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    // assert the result
    expect(result).toBe(false);
    // @ts-expect-error
    expect(itemDragAndDrop.isItemMoveValid).toHaveBeenCalledWith(itemMoveData, testCharacter);
    // @ts-expect-error
    expect(itemDragAndDrop.sendRefreshItemsEvent).not.toHaveBeenCalled();
  });

  it("should return false if item to be moved is not found", async () => {
    const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    // assert the result
    expect(result).toBe(false);
    // @ts-expect-error
    expect(itemDragAndDrop.sendRefreshItemsEvent).not.toHaveBeenCalled();
  });

  it("should return false if item to be moved to is not found", async () => {
    // setup test data and mocks
    itemMoveData.to.item = { _id: "62b792030c3f470048781135" } as any;

    jest.spyOn(Item, "findById").mockResolvedValueOnce({ _id: testItem._id } as any);
    // @ts-expect-error
    jest.spyOn(ItemContainer, "findById").mockResolvedValue({ _id: "containerId", items: [{ _id: testItem._id }] });

    const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    // assert the result
    expect(result).toBe(false);
    // @ts-expect-error
    expect(itemDragAndDrop.sendRefreshItemsEvent).not.toHaveBeenCalled();
    // @ts-expect-error
    expect(itemDragAndDrop.socketMessaging.sendErrorMessageToCharacter).toHaveBeenCalledWith(
      testCharacter,
      "Sorry, item to be moved to wasn't found."
    );
  });

  it("should return false if items are moved between different sources", async () => {
    // setup test data and mocks
    itemMoveData.to.source = "Equipment";
    jest.spyOn(Item, "findById").mockResolvedValueOnce({ _id: testItem._id } as any);
    // @ts-expect-error
    jest.spyOn(ItemContainer, "findById").mockResolvedValue({ _id: "containerId", items: [{ _id: testItem._id }] });

    const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    // assert the result
    expect(result).toBe(false);
    // @ts-expect-error
    expect(itemDragAndDrop.sendRefreshItemsEvent).not.toHaveBeenCalled();
    // @ts-expect-error
    expect(itemDragAndDrop.socketMessaging.sendErrorMessageToCharacter).toHaveBeenCalledWith(
      testCharacter,
      "Sorry, you can't move items between different sources."
    );
  });

  it("should send an error message if an exception occurs during item move", async () => {
    // setup test data and mocks
    jest.spyOn(Item, "findById").mockResolvedValueOnce({ _id: testItem._id } as any);
    // @ts-expect-error
    jest.spyOn(ItemContainer, "findById").mockResolvedValue({ _id: "containerId", items: [{ _id: testItem._id }] });
    // @ts-expect-error
    jest.spyOn(itemDragAndDrop, "moveItemInInventory").mockRejectedValue(new Error("Some error occurred"));

    const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    // assert the result
    expect(result).toBe(false);
    // @ts-expect-error
    expect(itemDragAndDrop.sendRefreshItemsEvent).not.toHaveBeenCalled();
    // @ts-expect-error
    expect(itemDragAndDrop.socketMessaging.sendErrorMessageToCharacter).toHaveBeenCalledWith(testCharacter);
  });

  it("should send refresh items event after a successful move", async () => {
    // setup test data and mocks
    jest.spyOn(Item, "findById").mockResolvedValueOnce({ _id: testItem._id } as any);
    // @ts-expect-error
    jest.spyOn(ItemContainer, "findById").mockResolvedValue({ _id: "containerId", items: [{ _id: testItem._id }] });

    const result = await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    // assert the result
    expect(result).toBe(true);
    // @ts-expect-error
    expect(itemDragAndDrop.sendRefreshItemsEvent).toHaveBeenCalledWith(
      {
        inventory: { _id: "containerId", items: [{ _id: testItem._id }] },
        openEquipmentSetOnUpdate: false,
        openInventoryOnUpdate: false,
      },
      testCharacter
    );
  });

  it("should call isItemMoveValid method and moveItemInInventory", async () => {
    jest.spyOn(Item, "findById").mockResolvedValueOnce({ _id: testItem._id } as any);
    // @ts-expect-error
    jest.spyOn(ItemContainer, "findById").mockResolvedValue({ _id: "containerId", items: [{ _id: testItem._id }] });

    await itemDragAndDrop.performItemMove(itemMoveData, testCharacter);

    // assert the result
    // @ts-expect-error
    expect(itemDragAndDrop.isItemMoveValid).toHaveBeenCalledWith(itemMoveData, testCharacter);
    // @ts-expect-error
    expect(itemDragAndDrop.moveItemInInventory).toHaveBeenCalledWith(
      itemMoveData.from,
      itemMoveData.to,
      testCharacter,
      itemMoveData.from.containerId,
      itemMoveData.quantity
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
