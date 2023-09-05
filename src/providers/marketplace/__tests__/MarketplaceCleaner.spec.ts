import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IDepot } from "@entities/ModuleDepot/DepotModel";
import { MarketplaceItem } from "@entities/ModuleMarketplace/MarketplaceItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { DepotFinder } from "@providers/depot/DepotFinder";
import { container, unitTestHelper } from "@providers/inversify/container";
import dayjs from "dayjs";
import { MarketplaceCleaner } from "../MarketplaceCleaner";

describe("MarketplaceCleaner.spec.ts", () => {
  let marketplaceCleaner: MarketplaceCleaner;
  let depotFinder: DepotFinder;
  let testCharacter: ICharacter;
  let testNPC: INPC;
  let testDepot: IDepot;

  beforeAll(() => {
    marketplaceCleaner = container.get(MarketplaceCleaner);
  });

  beforeAll(() => {
    depotFinder = container.get(DepotFinder);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC({
      hasDepot: true,
    });
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });

    testDepot = await unitTestHelper.createMockDepot(testNPC, testCharacter._id);
  });

  describe("Item deletion from inactive characters", () => {
    it("should NOT delete items from inactive characters WHEN DEPOT ROLLBACK SUCCEEDS", async () => {
      // @ts-ignore
      const depotRollbackSpy = jest.spyOn(marketplaceCleaner.characterItemContainer, "addItemToContainer");

      testCharacter.updatedAt = dayjs().subtract(3, "months").toDate();
      await testCharacter.save({
        // @ts-ignore
        timestamps: {
          updatedAt: false,
        },
      });

      const testItem = await unitTestHelper.createMockItem();

      const newMarketplaceEntry = new MarketplaceItem({
        item: testItem._id,
        owner: testCharacter._id,
        price: 100,
      });
      await newMarketplaceEntry.save();

      const deletedItems = await marketplaceCleaner.deleteItemsFromInactiveCharacters();

      expect(deletedItems).toBe(0);

      expect(depotRollbackSpy).toHaveBeenCalledTimes(1);
    });

    it("should delete items from inactive characters WHEN DEPOT ROLLBACK FAILS", async () => {
      // @ts-ignore
      // eslint-disable-next-line require-await
      jest.spyOn(marketplaceCleaner.characterItemContainer, "addItemToContainer").mockImplementationOnce(async () => {
        return false;
      });

      testCharacter.updatedAt = dayjs().subtract(3, "months").toDate();
      await testCharacter.save({
        // @ts-ignore
        timestamps: {
          updatedAt: false,
        },
      });

      const testItem = await unitTestHelper.createMockItem();

      const newMarketplaceEntry = new MarketplaceItem({
        item: testItem._id,
        owner: testCharacter._id,
        price: 100,
      });
      await newMarketplaceEntry.save();

      const deletedItems = await marketplaceCleaner.deleteItemsFromInactiveCharacters();

      expect(deletedItems).toBe(1);
    });

    it("should NOT delete items from ACTIVE characters", async () => {
      const testItem = await unitTestHelper.createMockItem();

      const newMarketplaceEntry = new MarketplaceItem({
        item: testItem._id,
        owner: testCharacter._id,
        price: 100,
      });
      await newMarketplaceEntry.save();

      const deletedItems = await marketplaceCleaner.deleteItemsFromInactiveCharacters();

      expect(deletedItems).toBe(0);
    });
  });

  describe("Item rollback to depot", () => {
    it("Should properly rollback items that were added more than 1 week ago to the depot", async () => {
      const testItem = await unitTestHelper.createMockItem();

      const moreThan1WeekAgo = dayjs().subtract(2, "week").toDate();

      const newMarketplaceEntry = new MarketplaceItem({
        item: testItem._id,
        owner: testCharacter._id,
        price: 100,
        createdAt: moreThan1WeekAgo,
      });
      await newMarketplaceEntry.save();

      const rolledBackItems = await marketplaceCleaner.rollbackItemsMoreThan1WeekOld();

      expect(rolledBackItems).toBe(1);
    });

    it("should not rollback items that were added less than 1 week ago to the depot", async () => {
      const testItem = await unitTestHelper.createMockItem();

      const lessThan1WeekAgo = dayjs().subtract(3, "day").toDate();

      const newMarketplaceEntry = new MarketplaceItem({
        item: testItem._id,
        owner: testCharacter._id,
        price: 100,
        createdAt: lessThan1WeekAgo,
      });
      await newMarketplaceEntry.save();

      const rolledBackItems = await marketplaceCleaner.rollbackItemsMoreThan1WeekOld();

      expect(rolledBackItems).toBe(0);
    });
  });
});
