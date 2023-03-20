import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";

import { PotionsBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { GRID_HEIGHT, GRID_WIDTH, ITradeRequestItem } from "@rpg-engine/shared";
import { CharacterTradingValidation } from "../CharacterTradingValidation";
import { CharacterValidation } from "../CharacterValidation";

import { itemGroundBlood } from "@providers/item/data/blueprints/effects/ItemGroundBlood";
import { itemBroadSword } from "@providers/item/data/blueprints/swords/tier1/ItemBroadSword";
import { itemKatana } from "@providers/item/data/blueprints/swords/tier1/ItemKatana";
import { itemIceSword } from "@providers/item/data/blueprints/swords/tier2/ItemIceSword";

describe("CharacterTradingValidation.ts", () => {
  let testCharacter: ICharacter;
  let testNPCTrader: INPC;
  let nonTraderNPC: INPC;
  let characterTradingValidation: CharacterTradingValidation;
  let sendErrorMessageToCharacter: jest.SpyInstance;
  let transactionItems: ITradeRequestItem[];
  let transactionSellItems: ITradeRequestItem[];
  let inventoryItemContainerId: string;

  beforeAll(() => {
    characterTradingValidation = container.get<CharacterTradingValidation>(CharacterTradingValidation);

    transactionItems = [
      {
        key: PotionsBlueprint.LightEndurancePotion,
        qty: 1,
      },
    ];
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(
      {
        x: 0,
        y: 0,
      },
      { hasEquipment: true, hasInventory: true, hasSkills: false }
    );

    nonTraderNPC = await unitTestHelper.createMockNPC();

    testNPCTrader = await unitTestHelper.createMockNPC({
      x: 0,
      y: 0,
      isTrader: true,
      traderItems: [
        {
          key: PotionsBlueprint.LightEndurancePotion,
        },
        {
          key: SwordsBlueprint.ShortSword,
        },
      ],
    });

    const testItem1 = new Item(itemIceSword);
    await testItem1.save();

    const testItem2 = new Item(itemIceSword);
    await testItem2.save();

    const testItem3 = new Item(itemKatana);
    await testItem3.save();

    const inventory = await testCharacter.inventory;
    inventoryItemContainerId = inventory.itemContainer as unknown as string;

    await addItemToInventory(testItem1, 0);
    await addItemToInventory(testItem2, 1);
    await addItemToInventory(testItem3, 2);

    transactionSellItems = [
      {
        key: itemIceSword.key!,
        qty: 1,
      },
    ];

    // @ts-ignore
    sendErrorMessageToCharacter = jest.spyOn(characterTradingValidation.socketMessaging, "sendErrorMessageToCharacter");
  });

  afterEach(() => {
    sendErrorMessageToCharacter.mockRestore();
  });

  const getInventoryContainer = async (): Promise<IItemContainer> => {
    return (await ItemContainer.findById(inventoryItemContainerId)) as unknown as IItemContainer;
  };

  const addItemToInventory = async (item: IItem, slotIndex: number): Promise<IItem> => {
    const bag = await getInventoryContainer();
    if (bag) {
      bag.slots[slotIndex] = item;
      await ItemContainer.updateOne(
        {
          _id: bag.id,
        },
        {
          $set: {
            slots: bag.slots,
          },
        }
      );
    }
    return item;
  };

  it("should check if a trader NPC has the property isTrader set to true and has items ", () => {
    expect(testNPCTrader.isTrader).toBe(true);

    expect(testNPCTrader.traderItems!.length > 1).toBe(true);
  });

  it("should thrown an error if trader is not a trader NPC", () => {
    const isValid = characterTradingValidation.validateTransaction(testCharacter, nonTraderNPC, transactionItems);

    expect(isValid).toBe(false);

    expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(testCharacter, "This NPC is not a trader.");
  });

  it("should throw an error if a NPC is a trader, but has no items for sale", async () => {
    testNPCTrader.traderItems = [];
    await testNPCTrader.save();

    const isValid = characterTradingValidation.validateTransaction(testCharacter, testNPCTrader, transactionItems);

    expect(isValid).toBe(false);

    expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(testCharacter, "Sorry, this NPC has no items for sale.");
  });

  it("should throw an error if the character is too far away from the trader NPC", async () => {
    testNPCTrader.x = GRID_WIDTH * 10;
    testNPCTrader.y = GRID_HEIGHT * 10;
    await testNPCTrader.save();

    const isValid = characterTradingValidation.validateTransaction(testCharacter, testNPCTrader, transactionItems);

    expect(isValid).toBe(false);

    expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(testCharacter, "You are too far away from the trader.");
  });

  it("should fail if an invalid blueprint item is used", () => {
    transactionItems = [
      {
        key: "invalid-blueprint-key",
        qty: 1,
      },
    ];

    const isValid = characterTradingValidation.validateTransaction(testCharacter, testNPCTrader, transactionItems);

    expect(isValid).toBe(false);

    expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
      testCharacter,
      "Sorry, one of the items you are trying to trade is not available."
    );
  });

  it("should throw an error if a transaction item has price or quantity <= 0", () => {
    transactionItems = [
      {
        key: PotionsBlueprint.LightEndurancePotion,
        qty: 0,
      },
    ];

    const isValid = characterTradingValidation.validateTransaction(testCharacter, testNPCTrader, transactionItems);

    expect(isValid).toBe(false);

    expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
      testCharacter,
      "Sorry, invalid parameters for light-endurance-potion."
    );
  });

  describe("validate sell request", () => {
    it("should pass validation", async () => {
      const result = await characterTradingValidation.validateSellTransaction(
        testCharacter,
        testNPCTrader,
        transactionSellItems
      );
      expect(result).toBeTruthy();
    });

    it("should call character validation", async () => {
      const characterValidationMock = jest.spyOn(CharacterValidation.prototype, "hasBasicValidation");
      characterValidationMock.mockReturnValue(false);

      let result = await characterTradingValidation.validateSellTransaction(
        testCharacter,
        testNPCTrader,
        transactionSellItems
      );
      expect(result).toBeFalsy();

      expect(characterValidationMock).toHaveBeenLastCalledWith(testCharacter);

      characterValidationMock.mockReset();
      characterValidationMock.mockReturnValue(true);

      result = await characterTradingValidation.validateSellTransaction(
        testCharacter,
        testNPCTrader,
        transactionSellItems
      );
      expect(result).toBeTruthy();

      characterValidationMock.mockRestore();
    });

    it("should fail if npc is not a trader", async () => {
      const result = await characterTradingValidation.validateSellTransaction(
        testCharacter,
        nonTraderNPC,
        transactionSellItems
      );
      expect(result).toBe(false);

      expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(testCharacter, "This NPC is not a trader.");
    });

    it("should fail if it items has invalid blue print key", async () => {
      // test with all items invalid
      let sellItems = [
        {
          key: "invalid-key",
          qty: 1,
        },
      ];

      let result = await characterTradingValidation.validateSellTransaction(testCharacter, testNPCTrader, sellItems);
      expect(result).toBe(false);

      expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
        testCharacter,
        "Sorry, one of the items you are trying to trade is not available."
      );

      // test with some valid items
      sendErrorMessageToCharacter.mockReset();
      sellItems = transactionSellItems.concat(sellItems);

      result = await characterTradingValidation.validateSellTransaction(testCharacter, testNPCTrader, sellItems);
      expect(result).toBe(false);

      expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
        testCharacter,
        "Sorry, one of the items you are trying to trade is not available."
      );
    });

    it("should fail if trader is not under range", async () => {
      const isUnderRangeMock = jest.spyOn(MovementHelper.prototype, "isUnderRange");
      isUnderRangeMock.mockReturnValue(false);

      testCharacter.x = 32;
      testCharacter.y = 44;
      await testCharacter.save();

      testNPCTrader.x = 44;
      testNPCTrader.y = 46;
      await testNPCTrader.save();

      let result = await characterTradingValidation.validateSellTransaction(
        testCharacter,
        testNPCTrader,
        transactionSellItems
      );
      expect(result).toBeFalsy();

      expect(isUnderRangeMock).toHaveBeenLastCalledWith(
        testCharacter.x,
        testCharacter.y,
        testNPCTrader.x,
        testNPCTrader.y,
        2
      );
      expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(testCharacter, "You are too far away from the trader.");

      isUnderRangeMock.mockReset();
      isUnderRangeMock.mockReturnValue(true);

      result = await characterTradingValidation.validateSellTransaction(
        testCharacter,
        testNPCTrader,
        transactionSellItems
      );
      expect(result).toBeTruthy();
    });

    it("should fail if character does not have an inventory", async () => {
      const equipment = await Equipment.findById(testCharacter.equipment);
      if (equipment) {
        equipment.inventory = undefined;
        await equipment.save();
      }

      const result = await characterTradingValidation.validateSellTransaction(
        testCharacter,
        testNPCTrader,
        transactionSellItems
      );
      expect(result).toBeFalsy();

      expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
        testCharacter,
        "Oops! The character does not have an inventory."
      );
    });

    it("should fail if character does not have an item container", async () => {
      const inventory = await testCharacter.inventory;

      if (inventory) {
        inventory.itemContainer = undefined;
        await inventory.save();
      }

      const result = await characterTradingValidation.validateSellTransaction(
        testCharacter,
        testNPCTrader,
        transactionSellItems
      );
      expect(result).toBeFalsy();

      expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
        testCharacter,
        "Oops! The character does not have an inventory."
      );
    });

    it("should fail if character does not have item in inventory", async () => {
      transactionSellItems.push({
        key: itemBroadSword.key!,
        qty: 1,
      });

      const result = await characterTradingValidation.validateSellTransaction(
        testCharacter,
        testNPCTrader,
        transactionSellItems
      );
      expect(result).toBeFalsy();

      expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
        testCharacter,
        `Sorry, You can not sell 1 ${itemBroadSword.name}. You only have 0.`
      );
    });

    it("should fail if item blue print does not have basePrice", async () => {
      transactionSellItems.push({
        key: itemGroundBlood.key!,
        qty: 1,
      });

      const result = await characterTradingValidation.validateSellTransaction(
        testCharacter,
        testNPCTrader,
        transactionSellItems
      );
      expect(result).toBeFalsy();

      expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
        testCharacter,
        `Sorry, ${itemGroundBlood.name} can not be sold.`
      );
    });

    it("should fail if character trying to sell more qty than in inventory", async () => {
      transactionSellItems = [
        {
          key: itemIceSword.key!,
          qty: 3,
        },
        {
          key: itemKatana.key!,
          qty: 1,
        },
      ];

      let result = await characterTradingValidation.validateSellTransaction(
        testCharacter,
        testNPCTrader,
        transactionSellItems
      );
      expect(result).toBeFalsy();

      expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
        testCharacter,
        `Sorry, You can not sell 3 ${itemIceSword.name}. You only have 2.`
      );

      sendErrorMessageToCharacter.mockReset();
      transactionSellItems = [
        {
          key: itemIceSword.key!,
          qty: 2,
        },
        {
          key: itemKatana.key!,
          qty: 2,
        },
      ];

      result = await characterTradingValidation.validateSellTransaction(
        testCharacter,
        testNPCTrader,
        transactionSellItems
      );
      expect(result).toBeFalsy();

      expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(
        testCharacter,
        `Sorry, You can not sell 2 ${itemKatana.name}. You only have 1.`
      );

      sendErrorMessageToCharacter.mockReset();
      transactionSellItems = [
        {
          key: itemIceSword.key!,
          qty: 2,
        },
        {
          key: itemKatana.key!,
          qty: 1,
        },
      ];

      result = await characterTradingValidation.validateSellTransaction(
        testCharacter,
        testNPCTrader,
        transactionSellItems
      );
      expect(result).toBeTruthy();
    });
  });
});
