/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import {
  OthersBlueprint,
  PotionsBlueprint,
  RangedWeaponsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { ITradeItem } from "@rpg-engine/shared";
import { CharacterTradingNPCBuy } from "../CharacterTradingNPCBuy";

describe("CharacterTradingValidation.ts", () => {
  let testCharacter: ICharacter;
  let testNPCTrader: INPC;

  let characterTradingNPCBuy: CharacterTradingNPCBuy;
  let sendErrorMessageToCharacter: jest.SpyInstance;
  let transactionItems: ITradeItem[];
  let inventory: IItem;
  let inventoryContainer: IItemContainer;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    characterTradingNPCBuy = container.get<CharacterTradingNPCBuy>(CharacterTradingNPCBuy);

    transactionItems = [
      {
        key: PotionsBlueprint.LightEndurancePotion,
        qty: 1,
      },
    ];
  });

  const prepareTransaction = async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter(
      {
        x: 0,
        y: 0,
      },
      { hasEquipment: true, hasInventory: true, hasSkills: true }
    );

    testNPCTrader = await unitTestHelper.createMockNPC({
      x: 0,
      y: 0,
      isTrader: true,
      traderItems: [
        {
          key: PotionsBlueprint.LightEndurancePotion,
          price: 15,
        },
        {
          key: SwordsBlueprint.ShortSword,
          price: 50,
        },
        {
          key: RangedWeaponsBlueprint.Arrow,
          price: 0.5,
        },
      ],
    });

    // @ts-ignore
    sendErrorMessageToCharacter = jest.spyOn(characterTradingNPCBuy.socketMessaging, "sendErrorMessageToCharacter");

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

    it("should properly buy a NON-STACKABLE item from a trader NPC", async () => {
      const result = await characterTradingNPCBuy.buyItemsFromNPC(testCharacter, testNPCTrader, transactionItems);

      expect(result).toBe(true);
      expect(sendErrorMessageToCharacter).not.toHaveBeenCalled();

      const updatedInventoryContainer = (await ItemContainer.findById(
        inventory.itemContainer
      )) as unknown as IItemContainer;

      expect(updatedInventoryContainer.slots[0].stackQty).toBe(85); // gold left
      expect(updatedInventoryContainer.slots[1].key).toBe(PotionsBlueprint.LightEndurancePotion); // potion bought
    });

    it("should properly buy a STACKABLE item from a trader NPC", async () => {
      transactionItems = [
        {
          key: RangedWeaponsBlueprint.Arrow,
          qty: 25,
        },
      ];

      const result = await characterTradingNPCBuy.buyItemsFromNPC(testCharacter, testNPCTrader, transactionItems);

      expect(result).toBe(true);

      expect(sendErrorMessageToCharacter).not.toHaveBeenCalled();

      const updatedInventoryContainer = (await ItemContainer.findById(
        inventory.itemContainer
      )) as unknown as IItemContainer;

      expect(updatedInventoryContainer.slots[0].stackQty).toBe(87.5); // gold left
      expect(updatedInventoryContainer.slots[1].key).toBe(RangedWeaponsBlueprint.Arrow); // potion bought
      expect(updatedInventoryContainer.slots[1].stackQty).toBe(25);
    });
  });

  describe("Error validations", () => {
    beforeEach(async () => {
      await prepareTransaction();
    });

    it("should fail if you try to buy a stackable item qty >= maxStackSize", () => {});

    it("should fail if we don't have enough gold for a purchase", () => {});
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
