import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Depot } from "@entities/ModuleDepot/DepotModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemMock } from "@providers/unitTests/mock/itemMock";
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
    expect(depotContainer.parentItem).toEqual(updatedDepot!._id);

    const container = updatedDepot!.itemContainer as unknown as IItemContainer;
    assertDepotContainer(container);
    expect(depotContainer._id).toEqual(container._id);
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
