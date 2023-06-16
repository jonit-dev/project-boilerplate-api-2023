import { IItem } from "@entities/ModuleInventory/ItemModel";
import { MarketplaceItemAddRemove } from "../MarketplaceItemAddRemove";
import { MarketplaceItem } from "@entities/ModuleMarketplace/MarketplaceItemModel";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Types } from "mongoose";

describe("MarketplaceItemAddRemove.ts", () => {
  let marketplaceItemAddRemove: MarketplaceItemAddRemove;
  let testCharacter: ICharacter;
  let characterInventory: CharacterInventory;
  let testItem: IItem;
  let testNPC: INPC;

  beforeAll(async () => {
    marketplaceItemAddRemove = container.get(MarketplaceItemAddRemove);
    characterInventory = container.get(CharacterInventory);
  });

  beforeEach(async () => {
    // Create test character
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    testNPC = await unitTestHelper.createMockNPC({
      hasDepot: true,
    });

    testCharacter.x = 1;
    testCharacter.y = 0;
    await testCharacter.save();

    testNPC.x = 1;
    testNPC.y = 1;
    await testNPC.save();

    // Create a test item
    testItem = await unitTestHelper.createMockItem({
      x: 0,
      y: 0,
      scene: "",
      key: "testItem",
    });
  });

  it("should fail if npc is not in range", async () => {
    testNPC.x = 100;
    testNPC.y = 100;
    await testNPC.save();

    const success = await marketplaceItemAddRemove.addItemToMarketplace(testCharacter, testNPC._id, {
      price: 100,
      itemId: testItem._id,
    });

    expect(success).toBe(false);
  });

  it("should add an item to marketplace", async () => {
    const inventory = await characterInventory.getInventory(testCharacter);
    const container = await ItemContainer.findById(inventory?.itemContainer);
    if (!container) {
      throw new Error("Container not found");
    }

    await container.updateOne({
      slots: {
        0: testItem,
      },
    });

    const success = await marketplaceItemAddRemove.addItemToMarketplace(testCharacter, testNPC._id, {
      price: 100,
      itemId: testItem._id,
    });

    expect(success).toBe(true);
    const marketPlaceItem = await MarketplaceItem.findOne({ item: testItem._id });
    expect(marketPlaceItem).not.toBeNull();
  });

  it("should fail to add an item to marketplace if the item is not in inventory", async () => {
    const success = await marketplaceItemAddRemove.addItemToMarketplace(testCharacter, testNPC._id, {
      price: 100,
      itemId: testItem._id,
    });

    expect(success).toBe(false);
    const marketPlaceItem = await MarketplaceItem.findOne({ item: testItem._id });
    expect(marketPlaceItem).toBeNull();
  });

  it("should fail to add an item to marketplace if the item doesn't exist", async () => {
    const success = await marketplaceItemAddRemove.addItemToMarketplace(testCharacter, testNPC._id, {
      price: 100,
      itemId: Types.ObjectId().toString(),
    });

    expect(success).toBe(false);
  });

  it("should remove an item from marketplace to inventory", async () => {
    const marketPlaceItem = new MarketplaceItem({
      price: 100,
      item: testItem._id,
      owner: testCharacter._id,
    });
    await marketPlaceItem.save();

    const success = await marketplaceItemAddRemove.removeItemFromMarketplaceToInventory(
      testCharacter,
      testNPC._id,
      marketPlaceItem._id
    );

    expect(success).toBe(true);
    const deletedMarketPlaceItem = await MarketplaceItem.findById(marketPlaceItem._id);
    expect(deletedMarketPlaceItem).toBeNull();
    const inventory = await characterInventory.getInventory(testCharacter);
    const container = await ItemContainer.findById(inventory?.itemContainer);
    if (!container) {
      throw new Error("Container not found");
    }
    expect(container.slots[0]).not.toBeNull();
  });

  it("should fail to remove an item from marketplace to inventory if the item doesn't exist", async () => {
    const success = await marketplaceItemAddRemove.removeItemFromMarketplaceToInventory(
      testCharacter,
      testNPC._id,
      Types.ObjectId().toString()
    );

    expect(success).toBe(false);
  });
});
