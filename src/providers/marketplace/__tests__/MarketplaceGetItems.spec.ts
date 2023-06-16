import { MarketplaceGetItems } from "../MarketplaceGetItems";
import { MarketplaceItem } from "@entities/ModuleMarketplace/MarketplaceItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemSubType, ItemRarities } from "@rpg-engine/shared";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";

describe("MarketplaceGetItems.ts", () => {
  let marketplaceGetItems: MarketplaceGetItems;
  let testCharacter: ICharacter;
  let testNPC: INPC;
  let testItem1: IItem, testItem2: IItem;

  beforeAll(() => {
    marketplaceGetItems = container.get(MarketplaceGetItems);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter();
    testNPC = await unitTestHelper.createMockNPC({
      hasDepot: true,
    });

    testCharacter.x = 1;
    testCharacter.y = 0;
    await testCharacter.save();

    testNPC.x = 1;
    testNPC.y = 1;
    await testNPC.save();

    // create test items
    testItem1 = await unitTestHelper.createMockItem({
      name: "Awesome Sword",
      x: 0,
      y: 0,
      scene: "",
      isItemContainer: true,
      subType: ItemSubType.Accessory, // Add this property to the mock function
      rarity: ItemRarities.Common, // Add this property to the mock function
    });

    testItem2 = await unitTestHelper.createMockItem({
      name: "Awesome Axe",
      x: 0,
      y: 0,
      scene: "",
      isItemContainer: true,
      subType: ItemSubType.Axe,
      rarity: ItemRarities.Rare,
    });

    await new MarketplaceItem({ price: 100, item: testItem1._id, owner: testCharacter._id }).save();
    await new MarketplaceItem({ price: 200, item: testItem2._id, owner: testCharacter._id }).save();
  });

  it("should retrieve items based on provided filters", async () => {
    const options = {
      orderBy: "price",
      order: "asc",
      price: [50, 150],
      itemType: ItemSubType.Accessory,
      itemRarity: ItemRarities.Common,
    } as any;

    const marketPlaceGetItemsResponse = await marketplaceGetItems.getItems(testCharacter, testNPC._id, options);
    if (!marketPlaceGetItemsResponse) {
      throw new Error("marketPlaceGetItemsResponse is undefined");
    }
    const { items } = marketPlaceGetItemsResponse;

    expect(items).toBeDefined();
    expect(items?.length).toEqual(1);
    expect((items[0].item as unknown as IItem)._id).toEqual(testItem1._id);
  });

  it("should retrieve items based on name search", async () => {
    const options = {
      name: "sword",
    } as any;

    const marketPlaceGetItemsResponse = await marketplaceGetItems.getItems(testCharacter, testNPC._id, options);
    if (!marketPlaceGetItemsResponse) {
      throw new Error("marketPlaceGetItemsResponse is undefined");
    }
    const { items } = marketPlaceGetItemsResponse;

    expect(items).toBeDefined();
    expect(items?.length).toEqual(1);
    expect((items[0].item as unknown as IItem)._id).toEqual(testItem1._id);
  });

  it("should return empty array if no items match the filters", async () => {
    const options = {
      price: [300, 400],
      itemType: ItemSubType.Axe,
      itemRarity: ItemRarities.Epic,
    } as any;

    const marketPlaceGetItemsResponse = await marketplaceGetItems.getItems(testCharacter, testNPC._id, options);
    if (!marketPlaceGetItemsResponse) {
      throw new Error("marketPlaceGetItemsResponse is undefined");
    }
    const { items } = marketPlaceGetItemsResponse;

    expect(items).toBeDefined();
    expect(items?.length).toEqual(0);
  });

  it("should return items sorted by price in ascending order", async () => {
    const options = {
      orderBy: "price",
      order: "asc",
    } as any;

    const marketPlaceGetItemsResponse = await marketplaceGetItems.getItems(testCharacter, testNPC._id, options);
    if (!marketPlaceGetItemsResponse) {
      throw new Error("marketPlaceGetItemsResponse is undefined");
    }
    const { items } = marketPlaceGetItemsResponse;

    expect(items).toBeDefined();
    expect(items?.length).toBeGreaterThanOrEqual(2);
    expect(items[0].price).toBeLessThanOrEqual(items[1].price);
  });

  it("should return items sorted by price in descending order", async () => {
    const options = {
      orderBy: "price",
      order: "desc",
    } as any;

    const marketPlaceGetItemsResponse = await marketplaceGetItems.getItems(testCharacter, testNPC._id, options);
    if (!marketPlaceGetItemsResponse) {
      throw new Error("marketPlaceGetItemsResponse is undefined");
    }
    const { items } = marketPlaceGetItemsResponse;

    expect(items).toBeDefined();
    expect(items?.length).toBeGreaterThanOrEqual(2);
    expect(items[0].price).toBeGreaterThanOrEqual(items[1].price);
  });

  it("should paginate results based on limit and page", async () => {
    const options = {
      limit: 1,
      page: 2,
    } as any;

    const marketPlaceGetItemsResponse = await marketplaceGetItems.getItems(testCharacter, testNPC._id, options);
    if (!marketPlaceGetItemsResponse) {
      throw new Error("marketPlaceGetItemsResponse is undefined");
    }
    const { items } = marketPlaceGetItemsResponse;

    expect(items).toBeDefined();
    expect(items?.length).toEqual(1);
    expect((items[0].item as unknown as IItem)._id).toEqual(testItem2._id);
  });

  it("should return items within the provided price range", async () => {
    const options = {
      price: [150, 250],
    } as any;

    const marketPlaceGetItemsResponse = await marketplaceGetItems.getItems(testCharacter, testNPC._id, options);
    if (!marketPlaceGetItemsResponse) {
      throw new Error("marketPlaceGetItemsResponse is undefined");
    }
    const { items } = marketPlaceGetItemsResponse;

    expect(items).toBeDefined();
    expect(items?.length).toEqual(1);
    expect((items[0].item as unknown as IItem)._id).toEqual(testItem2._id);
  });

  it("should filter items by owner", async () => {
    const anotherCharacter = await unitTestHelper.createMockCharacter();

    // create an item owned by another character
    const anotherItem = await unitTestHelper.createMockItem({
      name: "Awesome Bow",
      x: 0,
      y: 0,
      scene: "",
      isItemContainer: true,
      subType: ItemSubType.Ranged,
      rarity: ItemRarities.Common,
    });
    await new MarketplaceItem({ price: 300, item: anotherItem._id, owner: anotherCharacter._id }).save();

    const options = {
      owner: testCharacter._id.toString(), // filter by the first character's ID
    } as any;

    const marketPlaceGetItemsResponse = await marketplaceGetItems.getItems(testCharacter, testNPC._id, options);
    if (!marketPlaceGetItemsResponse) {
      throw new Error("marketPlaceGetItemsResponse is undefined");
    }
    const { items } = marketPlaceGetItemsResponse;

    // should only return items owned by the test character
    expect(items).toBeDefined();
    expect(items?.length).toEqual(2);
    expect((items[0].item as unknown as IItem)._id).toEqual(testItem1._id);
    expect((items[1].item as unknown as IItem)._id).toEqual(testItem2._id);
  });

  it("should return correct totalItems and totalPages for given limit", async () => {
    const options = {
      limit: 1,
      page: 1,
    } as any;

    const marketPlaceGetItemsResponse = await marketplaceGetItems.getItems(testCharacter, testNPC._id, options);
    if (!marketPlaceGetItemsResponse) {
      throw new Error("marketPlaceGetItemsResponse is undefined");
    }

    expect(marketPlaceGetItemsResponse).toBeDefined();
    expect(marketPlaceGetItemsResponse.totalItems).toEqual(2); // You have created 2 items in beforeEach
  });
});
