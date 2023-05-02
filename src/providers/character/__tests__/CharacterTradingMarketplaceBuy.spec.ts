import { CharacterTradeSocketEvents, ItemSocketEvents, ITradeRequestItem } from "@rpg-engine/shared";
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import {
  OthersBlueprint,
  PotionsBlueprint,
  RangedWeaponsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { CharacterTradingMarketplaceBuy } from "../CharacterTradingMarketplaceBuy";
import { IMarketplace } from "@entities/ModuleMarketplace/MarketplaceModel";
import { itemsBlueprintIndex } from "@providers/item/data";

describe("CharacterTradingMarketplaceBuy.ts", () => {
  let testCharacter: ICharacter;
  let testMarketplace: IMarketplace;

  let characterTradingMarketplaceBuy: CharacterTradingMarketplaceBuy;
  let sendErrorMessageToCharacter: jest.SpyInstance;
  let sendErrorMessageOnValidation: jest.SpyInstance;
  let sendEventToUserOnBuyItem: jest.SpyInstance;
  let sendEventToUserOnInitBuy: jest.SpyInstance;
  let transactionItems: ITradeRequestItem[];
  let inventory: IItem;
  let inventoryContainer: IItemContainer;

  beforeAll(() => {
    characterTradingMarketplaceBuy = container.get<CharacterTradingMarketplaceBuy>(CharacterTradingMarketplaceBuy);

    transactionItems = [
      {
        key: PotionsBlueprint.LightEndurancePotion,
        qty: 1,
      },
    ];
  });

  const prepareTransaction = async () => {
    testCharacter = await unitTestHelper.createMockCharacter(
      {
        x: 0,
        y: 0,
      },
      { hasEquipment: true, hasInventory: true, hasSkills: true }
    );

    testMarketplace = await unitTestHelper.createMockMarketplace([
      itemsBlueprintIndex[PotionsBlueprint.LightEndurancePotion],
      itemsBlueprintIndex[SwordsBlueprint.ShortSword],
      itemsBlueprintIndex[RangedWeaponsBlueprint.Arrow],
    ]);

    sendErrorMessageToCharacter = jest.spyOn(
      // @ts-ignore
      characterTradingMarketplaceBuy.characterTradingBuy.socketMessaging,
      "sendErrorMessageToCharacter"
    );

    sendErrorMessageOnValidation = jest.spyOn(
      // @ts-ignore
      characterTradingMarketplaceBuy.characterTradingValidation.socketMessaging,
      "sendErrorMessageToCharacter"
    );

    sendEventToUserOnBuyItem = jest.spyOn(
      // @ts-ignore
      characterTradingMarketplaceBuy.characterTradingBuy.socketMessaging,
      "sendEventToUser"
    );

    // @ts-ignore
    sendEventToUserOnInitBuy = jest.spyOn(characterTradingMarketplaceBuy.socketMessaging, "sendEventToUser");

    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;
  };

  describe("Transaction - Buy", () => {
    beforeEach(async () => {
      await prepareTransaction();

      const goldCoins = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
        stackQty: 100,
      });

      inventoryContainer.slotQty = 20;
      inventoryContainer.slots = {
        ...inventoryContainer.slots,
        0: goldCoins.toJSON({ virtuals: true }),
      };
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();
    });

    it("should properly buy a NON-STACKABLE item from a Marketplace", async () => {
      const result = await characterTradingMarketplaceBuy.buyItems(testCharacter, testMarketplace, transactionItems);

      expect(result).toBe(true);
      expect(sendErrorMessageToCharacter).not.toHaveBeenCalled();

      const updatedInventoryContainer = (await ItemContainer.findById(
        inventory.itemContainer
      )) as unknown as IItemContainer;

      expect(updatedInventoryContainer.slots[0].stackQty).toBe(77.5); // gold left
      expect(updatedInventoryContainer.slots[1].key).toBe(PotionsBlueprint.LightEndurancePotion); // potion bought

      expect(sendEventToUserOnBuyItem).toHaveBeenCalledWith(
        testCharacter.channelId!,
        ItemSocketEvents.EquipmentAndInventoryUpdate,
        {
          inventory: updatedInventoryContainer,
          openEquipmentSetOnUpdate: false,
          openInventoryOnUpdate: true,
        }
      );
    });

    it("should properly buy a STACKABLE item from a Marketplace", async () => {
      transactionItems = [
        {
          key: RangedWeaponsBlueprint.Arrow,
          qty: 25,
        },
      ];

      const result = await characterTradingMarketplaceBuy.buyItems(testCharacter, testMarketplace, transactionItems);

      expect(result).toBe(true);

      expect(sendErrorMessageToCharacter).not.toHaveBeenCalled();

      const updatedInventoryContainer = (await ItemContainer.findById(
        inventory.itemContainer
      )) as unknown as IItemContainer;

      expect(updatedInventoryContainer.slots[0].stackQty).toBe(62.5); // gold left
      expect(updatedInventoryContainer.slots[1].key).toBe(RangedWeaponsBlueprint.Arrow); // potion bought
      expect(updatedInventoryContainer.slots[1].stackQty).toBe(25);

      expect(sendEventToUserOnBuyItem).toHaveBeenCalledWith(
        testCharacter.channelId!,
        ItemSocketEvents.EquipmentAndInventoryUpdate,
        {
          inventory: updatedInventoryContainer,
          openEquipmentSetOnUpdate: false,
          openInventoryOnUpdate: true,
        }
      );
    });

    it("should not invoke trade if marketplace does not exist", async () => {
      await characterTradingMarketplaceBuy.initializeBuy(testCharacter._id, testCharacter);

      expect(sendEventToUserOnInitBuy).not.toBeCalled();

      expect(sendErrorMessageOnValidation).toBeCalled();
      expect(sendErrorMessageOnValidation).toHaveBeenLastCalledWith(
        testCharacter,
        "Sorry, the Marketplace you're trying to trade with is not available."
      );
    });

    it("should not invoke trade if marketplace is closed", async () => {
      testMarketplace.open = false;
      await testMarketplace.save();

      await characterTradingMarketplaceBuy.initializeBuy(testMarketplace._id, testCharacter);

      expect(sendEventToUserOnInitBuy).not.toBeCalled();

      expect(sendErrorMessageOnValidation).toBeCalled();
      expect(sendErrorMessageOnValidation).toHaveBeenLastCalledWith(
        testCharacter,
        "Sorry, the Marketplace you're trying to trade with is not available."
      );
    });
  });

  describe("Buy transaction initialization", () => {
    beforeEach(async () => {
      await prepareTransaction();

      const goldCoins = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
        stackQty: 100,
      });

      inventoryContainer.slotQty = 20;
      inventoryContainer.slots = {
        ...inventoryContainer.slots,
        0: goldCoins.toJSON({ virtuals: true }),
      };
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();
    });

    it("should properly initialize a buy transaction", async () => {
      await characterTradingMarketplaceBuy.initializeBuy(testMarketplace._id, testCharacter);

      const payload = {
        characterAvailableGold: 100,
        marketplaceId: testMarketplace._id,
        items: expect.arrayContaining([
          expect.objectContaining({
            key: PotionsBlueprint.LightEndurancePotion,
          }),
        ]),
        type: "buy",
      };

      expect(sendEventToUserOnInitBuy).toHaveBeenCalledWith(
        testCharacter.channelId!,
        CharacterTradeSocketEvents.MarketplaceTradeInit,
        payload
      );
    });
  });

  describe("Error validations", () => {
    beforeEach(async () => {
      await prepareTransaction();
    });

    it("should fail if you try to buy a stackable item qty >= maxStackSize", async () => {
      transactionItems = [
        {
          key: RangedWeaponsBlueprint.Arrow,
          qty: 999,
        },
      ];

      const result = await characterTradingMarketplaceBuy.buyItems(testCharacter, testMarketplace, transactionItems);

      expect(result).toBe(false);

      expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
        testCharacter,
        "You can't buy more than the max stack size for the item 'Arrow'."
      );
    });

    it("should fail if we don't have enough gold for a purchase", async () => {
      transactionItems = [
        {
          key: RangedWeaponsBlueprint.Arrow,
          qty: 100,
        },
      ];

      const goldCoins = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
        stackQty: 10,
      });

      inventoryContainer.slotQty = 20;
      inventoryContainer.slots = {
        ...inventoryContainer.slots,
        0: goldCoins.toJSON({ virtuals: true }),
      };
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      const result = await characterTradingMarketplaceBuy.buyItems(testCharacter, testMarketplace, transactionItems);

      expect(result).toBe(false);
      expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
        testCharacter,
        "You don't have enough gold for this purchase."
      );
    });
  });
});
