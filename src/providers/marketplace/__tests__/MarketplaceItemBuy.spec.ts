import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { IMarketplaceItem, MarketplaceItem } from "@entities/ModuleMarketplace/MarketplaceItemModel";
import { MarketplaceMoney } from "@entities/ModuleMarketplace/MarketplaceMoneyModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { container, unitTestHelper } from "@providers/inversify/container";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { Types } from "mongoose";
import { MarketplaceItemBuy } from "../MarketplaceItemBuy";

describe("MarketplaceItemBuy.ts", () => {
  let marketplaceItemBuy: MarketplaceItemBuy;
  let testCharacter: ICharacter;
  let characterInventory: CharacterInventory;
  let testItem: IItem;
  let testMarketplaceItem: IMarketplaceItem;
  let testNPC: INPC;

  beforeAll(() => {
    marketplaceItemBuy = container.get(MarketplaceItemBuy);
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
      key: "testMarketplaceItem",
    });

    // Create a test item
    testMarketplaceItem = new MarketplaceItem({
      price: 100,
      item: testItem, // Replace with actual item details
      owner: Types.ObjectId().toString(), // Simulating another user as owner
      isBeingBought: false,
    });
    await testMarketplaceItem.save();
  });

  it("should fail buying an item from marketplace if no gold is found", async () => {
    const success = await marketplaceItemBuy.buyItemFromMarketplace(
      testCharacter,
      testNPC._id,
      testMarketplaceItem._id
    );

    expect(success).toBe(false);
    const marketplaceItem = await MarketplaceItem.findById(testMarketplaceItem._id);
    expect(marketplaceItem).not.toBeNull();
  });

  it("should fail buying an item from marketplace if no space in inventory", async () => {
    const gold = await unitTestHelper.createMockItem({
      stackQty: 1000,
      maxStackSize: 10000,
      key: OthersBlueprint.GoldCoin,
    });
    const inventory = await characterInventory.getInventory(testCharacter);
    await ItemContainer.findByIdAndUpdate(inventory?.itemContainer, {
      slots: {
        0: gold,
      },
    });

    const success = await marketplaceItemBuy.buyItemFromMarketplace(
      testCharacter,
      testNPC._id,
      testMarketplaceItem._id
    );

    expect(success).toBe(false);
    const marketplaceItem = await MarketplaceItem.findById(testMarketplaceItem._id);
    expect(marketplaceItem).not.toBeNull();
  });

  it("should buy an item from marketplace and decrement gold", async () => {
    const gold = await unitTestHelper.createMockItem({
      stackQty: 1000,
      maxStackSize: 10000,
      key: OthersBlueprint.GoldCoin,
    });
    const inventory = await characterInventory.getInventory(testCharacter);
    await ItemContainer.findByIdAndUpdate(inventory?.itemContainer, {
      slots: {
        0: gold,
        1: null,
      },
    });

    const success = await marketplaceItemBuy.buyItemFromMarketplace(
      testCharacter,
      testNPC._id,
      testMarketplaceItem._id
    );

    expect(success).toBe(true);
    const marketplaceItem = await MarketplaceItem.findById(testMarketplaceItem._id);
    expect(marketplaceItem).toBeNull();

    const container = await ItemContainer.findById(inventory?.itemContainer);
    expect(container?.slots[0].stackQty).toBe(900);
  });

  it("should add gold to marketplace for the owner of the item", async () => {
    const gold = await unitTestHelper.createMockItem({
      stackQty: 1000,
      maxStackSize: 10000,
      key: OthersBlueprint.GoldCoin,
    });
    const inventory = await characterInventory.getInventory(testCharacter);
    await ItemContainer.findByIdAndUpdate(inventory?.itemContainer, {
      slots: {
        0: gold,
        1: null,
      },
    });

    await marketplaceItemBuy.buyItemFromMarketplace(testCharacter, testNPC._id, testMarketplaceItem._id);

    const marketplaceMoney = await MarketplaceMoney.findOne({ owner: testMarketplaceItem.owner });
    expect(marketplaceMoney?.money).toBe(100);
  });

  it("should fail to buy an item from marketplace if the item doesn't exist", async () => {
    const success = await marketplaceItemBuy.buyItemFromMarketplace(
      testCharacter,
      testNPC._id,
      Types.ObjectId().toString()
    );

    expect(success).toBe(false);
  });

  it("should fail to buy an item from marketplace if the character is the owner of the item", async () => {
    testMarketplaceItem.owner = testCharacter._id.toString();
    await testMarketplaceItem.save();

    const success = await marketplaceItemBuy.buyItemFromMarketplace(
      testCharacter,
      testNPC._id,
      testMarketplaceItem._id
    );

    expect(success).toBe(false);
  });
});
