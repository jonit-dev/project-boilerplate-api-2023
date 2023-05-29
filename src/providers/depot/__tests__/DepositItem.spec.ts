import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Depot, IDepot } from "@entities/ModuleDepot/DepotModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemMock } from "@providers/unitTests/mock/itemMock";
import { UISocketEvents } from "@rpg-engine/shared";
import { Types } from "mongoose";
import { DepositItem } from "../DepositItem";

describe("DepositItem.ts", () => {
  let depositItem: DepositItem,
    testNPC: INPC,
    testCharacter: ICharacter,
    item: IItem,
    characterItemSlots: CharacterItemSlots;

  beforeAll(() => {
    depositItem = container.get<DepositItem>(DepositItem);
    characterItemSlots = container.get<CharacterItemSlots>(CharacterItemSlots);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    testNPC = await unitTestHelper.createMockNPC();
    item = await unitTestHelper.createMockItem();
  });

  it("deposit item from map", async () => {
    item.x = 1;
    item.y = 0;
    await item.save();

    const depotContainer = await depositItem.deposit(testCharacter, {
      itemId: item.id,
      npcId: testNPC.id,
    });

    // container must contain the deposited item
    assertDepotContainer(depotContainer as unknown as IItemContainer);

    // fetch the itemContainer from db and validate that changes persisted
    const updatedDepot = await Depot.findOne({
      owner: Types.ObjectId(testCharacter.id),
      key: testNPC.key,
    })
      .populate("itemContainer")
      .exec();

    expect(updatedDepot).toBeDefined();
    expect(depotContainer?.parentItem).toEqual(updatedDepot!._id);

    const container = updatedDepot!.itemContainer as unknown as IItemContainer;
    assertDepotContainer(container);
    expect(depotContainer?._id).toEqual(container._id);
  });

  it("throws error for invalid item ID", async () => {
    const invalidItemId = Types.ObjectId();
    await expect(
      depositItem.deposit(testCharacter, {
        itemId: invalidItemId as string,
        npcId: testNPC.id,
      })
    ).rejects.toThrow(`DepotSystem > Item not found: ${invalidItemId}`);
  });

  it("throws error when removing item from map fails", async () => {
    item.x = 1;
    item.y = 0;
    await item.save();

    // Mock the failure of removing item from the map
    // @ts-ignore
    jest.spyOn(depositItem.itemView, "removeItemFromMap").mockImplementation(() => Promise.resolve(false));

    await expect(
      depositItem.deposit(testCharacter, {
        itemId: item.id,
        npcId: testNPC.id,
      })
    ).rejects.toThrow(`DepotSystem > Error removing item with id ${item.id} from map`);

    // Restore the original implementation after the test
    jest.restoreAllMocks();
  });

  it("deposit item from container", async () => {
    // remove item's coordinates (is equipped on characters item container)
    item.x = undefined;
    item.y = undefined;
    item.scene = undefined;
    await item.save();

    // equip charater's item container with item
    const characterEquipment = (await Equipment.findById(testCharacter.equipment)
      .populate("inventory")
      .exec()) as IEquipment;
    await unitTestHelper.equipItemsInBackpackSlot(characterEquipment, [item.id], true);
    const backpack = characterEquipment.inventory as unknown as IItem;

    const depotContainer = await depositItem.deposit(testCharacter, {
      itemId: item.id,
      npcId: testNPC.id,
      fromContainerId: backpack.itemContainer?.toString(),
    });

    assertDepotContainer(depotContainer as unknown as IItemContainer);

    // Check character's item container does NOT have the item anymore
    const characterItemContainer = (await ItemContainer.findById(backpack.itemContainer)) as unknown as IItemContainer;

    const foundItem = await characterItemSlots.findItemOnSlots(characterItemContainer as IItemContainer, item.id!);
    expect(foundItem).toBeUndefined();
  });

  describe("Edge cases", () => {
    let testCharacter: ICharacter;
    let testDepot: IDepot;
    let testDepotContainer: IItemContainer;
    let testNPC: INPC;
    let inventory: IItem;
    let inventoryContainer: IItemContainer;
    let characterInventory: CharacterInventory;
    let characterItemSlots: CharacterItemSlots;

    let sendEventToUserSpy: jest.SpyInstance;
    beforeAll(() => {
      characterItemSlots = container.get<CharacterItemSlots>(CharacterItemSlots);
      characterInventory = container.get<CharacterInventory>(CharacterInventory);
    });

    beforeEach(async () => {
      testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
      testNPC = await unitTestHelper.createMockNPC();

      testDepot = await unitTestHelper.createMockDepot(testNPC, testCharacter._id);

      if (!testDepot || !testDepot.itemContainer) {
        throw new Error("testDepot or testDepot.itemContainer is undefined");
      }

      testDepotContainer = (await ItemContainer.findById(testDepot.itemContainer)) as IItemContainer;

      inventory = (await characterInventory.getInventory(testCharacter)) as IItem;
      inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as IItemContainer;

      // @ts-ignore
      sendEventToUserSpy = jest.spyOn(depositItem.socketMessaging, "sendEventToUser");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("fails if trying to deposit an item in a full deposit, and does not remove the item from the character's inventory", async () => {
      testDepotContainer.slots = Array(40).fill(itemMock);
      await testDepotContainer.save();

      // add item to inventory
      inventoryContainer.slots[0] = item;
      await inventoryContainer.save();

      const result = await depositItem.deposit(testCharacter, {
        itemId: item._id,
        npcId: testNPC._id,
        fromContainerId: inventoryContainer._id,
      });
      // Try to deposit item
      expect(result).toBeUndefined();

      expect(sendEventToUserSpy).toHaveBeenCalledWith(
        testCharacter.channelId!,
        UISocketEvents.ShowMessage,
        expect.objectContaining({
          message: expect.stringContaining("Sorry, your depot is full."),
        })
      );

      // Check that item still exists in character's inventory

      inventoryContainer = (await ItemContainer.findById(inventory.itemContainer).lean()) as IItemContainer;

      expect(inventoryContainer.slots[0]).toBeDefined();
    });
  });
});

function assertDepotContainer(depotContainer: IItemContainer): void {
  expect(depotContainer).toBeDefined();
  expect(depotContainer!.slotQty).toEqual(40);
  // container must contain the deposited item
  // all other slots should be empty
  for (const i in depotContainer!.slots) {
    if (i === "0") {
      // item should be deposited on first available slot
      const storedItem = depotContainer!.slots[i];
      expect(storedItem).toBeDefined();
      expect(storedItem?.type).toEqual(itemMock.type!);
      continue;
    }
    expect(depotContainer!.slots[i]).toBeNull();
  }
}
