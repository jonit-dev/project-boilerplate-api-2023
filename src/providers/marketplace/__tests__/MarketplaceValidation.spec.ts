import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { MarketplaceValidation } from "../MarketplaceValidation";

describe("MarketplaceValidation.ts", () => {
  let marketplaceValidation: MarketplaceValidation;
  let testCharacter: ICharacter;
  let testItem: IItem;
  let testNPC: INPC;

  const mockSocketMessaging = {
    sendErrorMessageToCharacter: jest.fn(),
  };

  beforeEach(async () => {
    marketplaceValidation = container.get(MarketplaceValidation);

    // @ts-expect-error
    marketplaceValidation.socketMessaging = mockSocketMessaging;

    // Create test character
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    testCharacter.x = 1;
    testCharacter.y = 0;
    await testCharacter.save();

    testNPC = await unitTestHelper.createMockNPC({
      hasDepot: true,
    });

    testNPC.x = 1;
    testNPC.y = 1;
    await testNPC.save();

    testItem = await unitTestHelper.createMockItem({
      x: 0,
      y: 0,
      scene: "",
      key: "testMarketplaceItem",
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("hasBasicValidation", () => {
    it("should return false if character validation fails", async () => {
      // @ts-expect-error
      marketplaceValidation.characterValidation.hasBasicValidation = jest.fn().mockReturnValue(false);

      const result = await marketplaceValidation.hasBasicValidation(testCharacter, testNPC.id);

      expect(result).toBe(false);
    });

    it("should return true if NPC id is an empty string provided", async () => {
      const result = await marketplaceValidation.hasBasicValidation(testCharacter, "");

      expect(result).toBe(true);
    });

    it("should return false if NPC validation fails", async () => {
      // @ts-expect-error
      marketplaceValidation.characterValidation.hasBasicValidation = jest.fn().mockReturnValue(true);
      // @ts-expect-error
      marketplaceValidation.depotSystem.npcBasicValidation = jest.fn().mockReturnValue(null);

      const result = await marketplaceValidation.hasBasicValidation(testCharacter, "123");

      expect(result).toBe(false);
      expect(mockSocketMessaging.sendErrorMessageToCharacter).toHaveBeenCalled();
    });

    it("should return false if character is out of NPC's reach", async () => {
      // @ts-expect-error
      marketplaceValidation.characterValidation.hasBasicValidation = jest.fn().mockReturnValue(true);
      // @ts-expect-error
      marketplaceValidation.depotSystem.npcBasicValidation = jest.fn().mockReturnValue(testNPC);
      // @ts-expect-error
      marketplaceValidation.movementHelper.isUnderRange = jest.fn().mockReturnValue(false);

      const result = await marketplaceValidation.hasBasicValidation(testCharacter, testNPC.id);

      expect(result).toBe(false);
      expect(mockSocketMessaging.sendErrorMessageToCharacter).toHaveBeenCalledWith(
        testCharacter,
        "NPC out of reach..."
      );
    });

    it("should return true if character is within NPC's reach", async () => {
      // @ts-expect-error
      marketplaceValidation.characterValidation.hasBasicValidation = jest.fn().mockReturnValue(true);
      // @ts-expect-error
      marketplaceValidation.depotSystem.npcBasicValidation = jest.fn().mockReturnValue(testNPC);
      // @ts-expect-error
      marketplaceValidation.movementHelper.isUnderRange = jest.fn().mockReturnValue(true);

      const result = await marketplaceValidation.hasBasicValidation(testCharacter, testNPC.id);

      expect(result).toBe(true);
    });
  });

  describe("isItemValid", () => {
    it("should return false if item key is blocked", () => {
      // gold-coin is a blocked item key
      testItem.key = "gold-coin";

      const result = marketplaceValidation.isItemValid(testItem);

      expect(result).toBe(false);
    });

    it("should return true if item key is not blocked", () => {
      // Suppose "allowedItemKey" is not a blocked item key
      testItem.key = "allowedItemKey";

      const result = marketplaceValidation.isItemValid(testItem);

      expect(result).toBe(true);
    });
  });
});
