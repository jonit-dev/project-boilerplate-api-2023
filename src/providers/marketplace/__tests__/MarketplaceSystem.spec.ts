import { IMarketplace, Marketplace } from "@entities/ModuleMarketplace/MarketplaceModel";
import { MarketplaceSystem } from "../MarketplaceSystem";
import { itemsBlueprintIndex } from "@providers/item/data";
import { AxesBlueprint, PotionsBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";

describe("MarketplaceSystem.ts", () => {
  const marketplaceSystem = new MarketplaceSystem();
  const marketplaceName = "TestMarketplace";
  const nonExistentId = "644f0c9fd311de6b48eeeeee";
  let testMarketplace: IMarketplace;

  beforeEach(async () => {
    // create empty marketplace
    testMarketplace = new Marketplace({
      name: marketplaceName,
      open: true,
    });
    testMarketplace = await testMarketplace.save();
  });

  it("should get existing marketplace", async () => {
    const marketplace = await marketplaceSystem.getMarketplace(testMarketplace.id);
    expect(marketplace).toBeDefined();
    expect(marketplace.open).toBeTruthy();
    expect(marketplace.name).toEqual(marketplaceName);
  });

  it("should throw error if marketplace does not exist", async () => {
    try {
      await marketplaceSystem.getMarketplace(nonExistentId);
      throw Error("this call should throw an error");
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toEqual(`Marketplace with id ${nonExistentId} does not exist`);
    }
  });

  it("should open an existing marketplace", async () => {
    testMarketplace.open = false;
    await testMarketplace.save();

    await marketplaceSystem.openMarketplace(testMarketplace.id);
    const updatedMarketplace = await Marketplace.findById(testMarketplace.id);
    expect(updatedMarketplace).toBeDefined();
    expect(updatedMarketplace!.open).toBeTruthy();
  });

  it("should close an existing marketplace", async () => {
    await marketplaceSystem.closeMarketplace(testMarketplace.id);
    const updatedMarketplace = await Marketplace.findById(testMarketplace.id);
    expect(updatedMarketplace).toBeDefined();
    expect(updatedMarketplace!.open).toBeFalsy();
  });

  it("should thow error if try to open an non-existent marketplace", async () => {
    try {
      await marketplaceSystem.openMarketplace(nonExistentId);
      throw Error("this call should throw an error");
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toEqual(`Marketplace with id ${nonExistentId} does not exist`);
    }
  });

  it("should add items to existing marketplace | empty marketplace", async () => {
    const newItems = [
      itemsBlueprintIndex[SwordsBlueprint.CorruptionSword],
      itemsBlueprintIndex[PotionsBlueprint.GreaterLifePotion],
      itemsBlueprintIndex[AxesBlueprint.Axe],
    ];
    await marketplaceSystem.addItems(testMarketplace.id, newItems);

    const updatedMarketplace = await Marketplace.findById(testMarketplace.id);
    expect(updatedMarketplace).toBeDefined();
    expect(updatedMarketplace!.open).toBeTruthy();
    expect(updatedMarketplace!.items).toBeDefined();
    expect(updatedMarketplace!.items?.length).toEqual(3);
    for (let i = 0; i < newItems.length; i++) {
      expect(updatedMarketplace!.items![i].key).toEqual(newItems[i].key);
    }
  });

  it("should add items to existing marketplace | marketplace with items, should not duplicate existing ones", async () => {
    testMarketplace.items = [
      itemsBlueprintIndex[SwordsBlueprint.CorruptionSword],
      itemsBlueprintIndex[PotionsBlueprint.GreaterLifePotion],
      itemsBlueprintIndex[AxesBlueprint.Axe],
    ] as any;
    await testMarketplace.save();

    const newItems = [
      itemsBlueprintIndex[SwordsBlueprint.CorruptionSword],
      itemsBlueprintIndex[PotionsBlueprint.GreaterLifePotion],
      itemsBlueprintIndex[AxesBlueprint.Axe],
    ];
    await marketplaceSystem.addItems(testMarketplace.id, newItems);

    const updatedMarketplace = await Marketplace.findById(testMarketplace.id);
    expect(updatedMarketplace).toBeDefined();
    expect(updatedMarketplace!.open).toBeTruthy();
    expect(updatedMarketplace!.items).toBeDefined();

    const expLen = newItems.length;
    expect(updatedMarketplace!.items?.length).toEqual(expLen);
    for (let i = 0; i < expLen; i++) {
      expect(updatedMarketplace!.items![i].key).toEqual(newItems[i].key);
    }
  });

  it("should add items to existing marketplace | marketplace with items, should add only new ones", async () => {
    testMarketplace.items = [
      itemsBlueprintIndex[SwordsBlueprint.CorruptionSword],
      itemsBlueprintIndex[PotionsBlueprint.LightAntidote],
      itemsBlueprintIndex[AxesBlueprint.CorruptionAxe],
    ] as any;
    await testMarketplace.save();

    const newItems = [
      itemsBlueprintIndex[SwordsBlueprint.CorruptionSword],
      itemsBlueprintIndex[PotionsBlueprint.GreaterLifePotion],
      itemsBlueprintIndex[AxesBlueprint.Axe],
    ];

    // add items
    await marketplaceSystem.addItems(testMarketplace.id, newItems);

    // check result
    const expItems = [
      itemsBlueprintIndex[SwordsBlueprint.CorruptionSword],
      itemsBlueprintIndex[PotionsBlueprint.LightAntidote],
      itemsBlueprintIndex[AxesBlueprint.CorruptionAxe],
      itemsBlueprintIndex[PotionsBlueprint.GreaterLifePotion],
      itemsBlueprintIndex[AxesBlueprint.Axe],
    ];
    const expLen = expItems.length;
    const updatedMarketplace = await Marketplace.findById(testMarketplace.id);
    expect(updatedMarketplace).toBeDefined();
    expect(updatedMarketplace!.open).toBeTruthy();
    expect(updatedMarketplace!.items).toBeDefined();
    expect(updatedMarketplace!.items?.length).toEqual(expLen);
    for (let i = 0; i < expLen; i++) {
      expect(updatedMarketplace!.items![i].key).toEqual(expItems[i].key);
    }
  });
});
