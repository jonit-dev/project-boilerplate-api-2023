import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { MarketplaceMoney } from "@entities/ModuleMarketplace/MarketplaceMoneyModel";
import { MarketplaceMoneyWithdraw } from "../MarketplaceMoneyWithdraw";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";

describe("MarketplaceMoneyWithdraw.ts", () => {
  let marketplaceMoneyWithdraw: MarketplaceMoneyWithdraw;
  let testCharacter: ICharacter;
  let characterInventory: CharacterInventory;
  let testNPC: INPC;

  beforeAll(async () => {
    characterInventory = container.get(CharacterInventory);
    marketplaceMoneyWithdraw = container.get(MarketplaceMoneyWithdraw);
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
  });

  it("should correctly withdraw all money if slots are available", async () => {
    await MarketplaceMoney.create({
      owner: testCharacter._id,
      money: 100,
    });

    const success = await marketplaceMoneyWithdraw.withdrawMoneyFromMarketplace(testCharacter, testNPC._id);

    expect(success).toBe(true);
    const marketplaceMoney = await MarketplaceMoney.findOne({ owner: testCharacter._id });
    expect(marketplaceMoney).toBeNull();
  });

  it("should fail withdrawing money if no money is found", async () => {
    const success = await marketplaceMoneyWithdraw.withdrawMoneyFromMarketplace(testCharacter, testNPC._id);

    expect(success).toBe(false);
  });

  it("should fail to withdraw money if there is no space in bag", async () => {
    await MarketplaceMoney.create({
      owner: testCharacter._id,
      money: 1000,
    });

    const gold = await unitTestHelper.createMockItem({
      stackQty: 9999,
      maxStackSize: 9999,
      key: OthersBlueprint.GoldCoin,
    });
    const inventory = await characterInventory.getInventory(testCharacter);
    await ItemContainer.findByIdAndUpdate(inventory?.itemContainer, {
      slots: {
        0: gold,
      },
    });

    const success = await marketplaceMoneyWithdraw.withdrawMoneyFromMarketplace(testCharacter, testNPC._id);

    expect(success).toBe(true);
    const marketplaceMoney = await MarketplaceMoney.findOne({ owner: testCharacter._id });
    expect(marketplaceMoney?.money).toBe(1000);
  });

  it("should correctly withdraw all money to available slot", async () => {
    await MarketplaceMoney.create({
      owner: testCharacter._id,
      money: 100,
    });

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

    const success = await marketplaceMoneyWithdraw.withdrawMoneyFromMarketplace(testCharacter, testNPC._id);

    expect(success).toBe(true);
    const marketplaceMoney = await MarketplaceMoney.findOne({ owner: testCharacter._id });
    expect(marketplaceMoney).toBeNull();

    const container = await ItemContainer.findById(inventory?.itemContainer);
    expect(container?.slots[0].stackQty).toBe(1100);
  });

  it("should withdraw only part of the money if there is no space in bag", async () => {
    await MarketplaceMoney.create({
      owner: testCharacter._id,
      money: 11000,
    });

    const gold = await unitTestHelper.createMockItem({
      stackQty: 9000,
      maxStackSize: 9999,
      key: OthersBlueprint.GoldCoin,
    });
    const inventory = await characterInventory.getInventory(testCharacter);
    await ItemContainer.findByIdAndUpdate(inventory?.itemContainer, {
      slots: {
        0: null,
        1: gold,
      },
    });

    const success = await marketplaceMoneyWithdraw.withdrawMoneyFromMarketplace(testCharacter, testNPC._id);

    expect(success).toBe(true);
    const marketplaceMoney = await MarketplaceMoney.findOne({ owner: testCharacter._id });
    expect(marketplaceMoney?.money).toBe(2);

    const container = await ItemContainer.findById(inventory?.itemContainer);
    expect(container?.slots[0].stackQty).toBe(9999);
    expect(container?.slots[1].stackQty).toBe(9999);
  });
});
