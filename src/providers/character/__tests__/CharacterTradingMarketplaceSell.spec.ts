/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { IMarketplace } from "@entities/ModuleMarketplace/MarketplaceModel";
import { MARKETPLACE_SELL_PRICE_MULTIPLIER } from "@providers/constants/ItemConstants";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import {
  AccessoriesBlueprint,
  OthersBlueprint,
  RangedWeaponsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterTradeSocketEvents, ItemSocketEvents } from "@rpg-engine/shared";
import { CharacterTradingMarketplaceSell } from "../CharacterTradingMarketplaceSell";
import { CharacterTradingValidation } from "../CharacterTradingValidation";
import { CharacterItemInventory } from "../characterItems/CharacterItemInventory";

describe("CharacterTradingMarketplaceSell.ts", () => {
  let testCharacter: ICharacter;
  let testMarketplace: IMarketplace;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;

  let characterTradingMarketplaceSell: CharacterTradingMarketplaceSell;
  let sendErrorMessageToCharacter: jest.SpyInstance;
  let sendEventToUserOnSellItem: jest.SpyInstance;
  let sendEventToUserOnInitSell: jest.SpyInstance;
  let validationMock: jest.SpyInstance;

  beforeAll(() => {
    characterTradingMarketplaceSell = container.get<CharacterTradingMarketplaceSell>(CharacterTradingMarketplaceSell);
  });

  const addItemsToInventory = async () => {
    const items = [
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Bow),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Bow),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Arrow, { stackQty: 50 }),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Arrow, { stackQty: 50 }),
    ];

    await unitTestHelper.addItemsToContainer(inventoryContainer, 6, items);
  };

  const prepareData = async () => {
    testCharacter = await unitTestHelper.createMockCharacter(
      {
        x: 0,
        y: 0,
      },
      { hasEquipment: true, hasInventory: true, hasSkills: true }
    );

    testMarketplace = await unitTestHelper.createMockMarketplace();

    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;
  };

  beforeEach(async () => {
    await prepareData();

    sendErrorMessageToCharacter = jest.spyOn(SocketMessaging.prototype, "sendErrorMessageToCharacter");
    sendErrorMessageToCharacter.mockImplementation();

    sendEventToUserOnSellItem = jest.spyOn(
      // @ts-ignore
      characterTradingMarketplaceSell.characterTradingSell.socketMessaging,
      "sendEventToUser"
    );

    // @ts-ignore
    sendEventToUserOnInitSell = jest.spyOn(characterTradingMarketplaceSell.socketMessaging, "sendEventToUser");

    validationMock = jest.spyOn(CharacterTradingValidation.prototype, "validateSellTransaction");
    validationMock.mockImplementation();
    validationMock.mockReturnValue(Promise.resolve(true));

    await addItemsToInventory();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should successfully sell stackable and non stackable items", async () => {
    await characterTradingMarketplaceSell.sellItems(testCharacter, [
      {
        key: RangedWeaponsBlueprint.Bow,
        qty: 1,
      },
      {
        key: RangedWeaponsBlueprint.Arrow,
        qty: 10,
      },
    ]);

    const updatedContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    expect(updatedContainer.slots[0]).not.toBeNull();
    expect(updatedContainer.slots[0].key).toBe(OthersBlueprint.GoldCoin);
    expect(updatedContainer.slots[0].stackQty).toBe(36.5);

    expect(updatedContainer.slots[2]).not.toBeNull();
    expect(updatedContainer.slots[2].key).toBe(RangedWeaponsBlueprint.Arrow);
    expect(updatedContainer.slots[2].stackQty).toBe(40);

    expect(sendErrorMessageToCharacter).not.toBeCalled();
    expect(sendEventToUserOnSellItem).toBeCalled();

    expect(sendEventToUserOnSellItem).toHaveBeenCalledWith(
      testCharacter.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      {
        inventory: updatedContainer,
        openEquipmentSetOnUpdate: false,
        openInventoryOnUpdate: true,
      }
    );
  });

  it("should not sell item if validation fails", async () => {
    validationMock.mockReturnValue(Promise.resolve(false));

    const sellItems = [
      {
        key: RangedWeaponsBlueprint.Bow,
        qty: 1,
      },
      {
        key: RangedWeaponsBlueprint.Arrow,
        qty: 10,
      },
    ];

    await characterTradingMarketplaceSell.sellItems(testCharacter, sellItems);

    const updatedContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    expect(updatedContainer.slots[0]).not.toBeNull();
    expect(updatedContainer.slots[0].key).toBe(RangedWeaponsBlueprint.Bow);

    expect(updatedContainer.slots[2]).not.toBeNull();
    expect(updatedContainer.slots[2].key).toBe(RangedWeaponsBlueprint.Arrow);
    expect(updatedContainer.slots[2].stackQty).toBe(50);

    expect(sendErrorMessageToCharacter).not.toBeCalled();
    expect(sendEventToUserOnSellItem).not.toBeCalled();

    expect(validationMock).toBeCalled();
    expect(validationMock).toBeCalledWith(testCharacter, sellItems);
  });

  it("should merge duplicate items qty before passing to validation", async () => {
    const sellItems = [
      {
        key: RangedWeaponsBlueprint.Bow,
        qty: 1,
      },
      {
        key: RangedWeaponsBlueprint.Bow,
        qty: 1,
      },
      {
        key: RangedWeaponsBlueprint.Arrow,
        qty: 10,
      },
      {
        key: RangedWeaponsBlueprint.Arrow,
        qty: 10,
      },
    ];

    await characterTradingMarketplaceSell.sellItems(testCharacter, sellItems);

    expect(validationMock).toBeCalled();
    expect(validationMock).toBeCalledWith(testCharacter, [
      {
        key: RangedWeaponsBlueprint.Bow,
        qty: 2,
      },
      {
        key: RangedWeaponsBlueprint.Arrow,
        qty: 20,
      },
    ]);
  });

  it("should sell all provided items with aggregated qty", async () => {
    const items = [
      await unitTestHelper.createMockItemFromBlueprint(AccessoriesBlueprint.Bandana),
      await unitTestHelper.createMockItemFromBlueprint(AccessoriesBlueprint.Bandana),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Arrow, { stackQty: 50 }),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Arrow, { stackQty: 50 }),
    ];

    await unitTestHelper.addItemsToContainer(inventoryContainer, 6, items);

    const sellItems = [
      {
        key: AccessoriesBlueprint.Bandana,
        qty: 1,
      },
      {
        key: AccessoriesBlueprint.Bandana,
        qty: 1,
      },
      {
        key: RangedWeaponsBlueprint.Arrow,
        qty: 10,
      },
      {
        key: RangedWeaponsBlueprint.Arrow,
        qty: 10,
      },
    ];

    await characterTradingMarketplaceSell.sellItems(testCharacter, sellItems);

    const updatedContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    expect(updatedContainer.slots[0]).not.toBeNull();
    expect(updatedContainer.slots[0].key).toBe(OthersBlueprint.GoldCoin);
    expect(updatedContainer.slots[0].stackQty).toBe(11);

    expect(updatedContainer.slots[1]).toBeNull();

    expect(updatedContainer.slots[2]).not.toBeNull();
    expect(updatedContainer.slots[2].key).toBe(RangedWeaponsBlueprint.Arrow);
    expect(updatedContainer.slots[2].stackQty).toBe(30);
  });

  it("should do nothing for empty items array", async () => {
    const sellItems = [];

    await characterTradingMarketplaceSell.sellItems(testCharacter, sellItems);

    const updatedContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;
    expect(updatedContainer.slots[0].key).toBe(RangedWeaponsBlueprint.Bow);
    expect(updatedContainer.slots[1].key).toBe(RangedWeaponsBlueprint.Bow);

    expect(updatedContainer.slots[2].key).toBe(RangedWeaponsBlueprint.Arrow);
    expect(updatedContainer.slots[2].stackQty).toBe(50);
    expect(updatedContainer.slots[3].key).toBe(RangedWeaponsBlueprint.Arrow);

    expect(updatedContainer.slots[4]).toBeUndefined();

    expect(sendErrorMessageToCharacter).not.toBeCalled();
    expect(sendEventToUserOnSellItem).not.toBeCalled();
  });

  it("should do no further processing if no items were sold", async () => {
    const decrementMock = jest.spyOn(CharacterItemInventory.prototype, "decrementItemFromNestedInventoryByKey");
    decrementMock.mockImplementation();
    decrementMock.mockReturnValue(Promise.resolve({ success: false, updatedQty: 0 }));

    await characterTradingMarketplaceSell.sellItems(testCharacter, [
      {
        key: RangedWeaponsBlueprint.Bow,
        qty: 1,
      },
    ]);

    const updatedContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;
    expect(updatedContainer.slots[0].key).toBe(RangedWeaponsBlueprint.Bow);
    expect(updatedContainer.slots[1].key).toBe(RangedWeaponsBlueprint.Bow);

    expect(updatedContainer.slots[2].key).toBe(RangedWeaponsBlueprint.Arrow);
    expect(updatedContainer.slots[2].stackQty).toBe(50);
    expect(updatedContainer.slots[3].key).toBe(RangedWeaponsBlueprint.Arrow);

    expect(updatedContainer.slots[4]).toBeUndefined();

    expect(sendErrorMessageToCharacter).not.toBeCalled();
    expect(sendEventToUserOnSellItem).not.toBeCalled();
  });

  it("should create two gold items if more gold earned than max stack size", async () => {
    const sellItems = [
      {
        key: RangedWeaponsBlueprint.Bow,
        qty: 2,
      },
      {
        key: RangedWeaponsBlueprint.Arrow,
        qty: 150,
      },
    ];

    await characterTradingMarketplaceSell.sellItems(testCharacter, sellItems);

    const updatedContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    expect(updatedContainer.slots[0]).not.toBeNull();
    expect(updatedContainer.slots[0].key).toBe(OthersBlueprint.GoldCoin);
    // character is equipped with 100 arrows
    // can only sell up to 100 arrows
    expect(updatedContainer.slots[0].stackQty).toBe(113);

    expect(updatedContainer.slots[1]).toBeNull();
    expect(updatedContainer.slots[2]).toBeNull();
    expect(updatedContainer.slots[3]).toBeNull();
  });

  it("should add gold to existing stack if possible", async () => {
    const items = [
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Bow),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Bow),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Arrow, { stackQty: 50 }),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Arrow, { stackQty: 50 }),
      await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, { stackQty: 10 }),
    ];

    await unitTestHelper.addItemsToContainer(inventoryContainer, 6, items);

    const sellItems = [
      {
        key: RangedWeaponsBlueprint.Bow,
        qty: 2,
      },
      {
        key: RangedWeaponsBlueprint.Arrow,
        qty: 100,
      },
    ];

    await characterTradingMarketplaceSell.sellItems(testCharacter, sellItems);

    const updatedContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    expect(updatedContainer.slots[4]).not.toBeNull();
    expect(updatedContainer.slots[4].key).toBe(OthersBlueprint.GoldCoin);
    expect(updatedContainer.slots[4].stackQty).toBe(123);

    expect(updatedContainer.slots[0]).toBeNull();
    expect(updatedContainer.slots[1]).toBeNull();
    expect(updatedContainer.slots[2]).toBeNull();
    expect(updatedContainer.slots[3]).toBeNull();
  });

  it("should return items to be sold", async () => {
    await characterTradingMarketplaceSell.initializeSell(testMarketplace._id, testCharacter);

    expect(sendEventToUserOnInitSell).toBeCalled();

    const Bow = itemsBlueprintIndex[RangedWeaponsBlueprint.Bow];
    const arrow = itemsBlueprintIndex[RangedWeaponsBlueprint.Arrow];

    expect(sendEventToUserOnInitSell).toHaveBeenLastCalledWith(
      testCharacter.channelId,
      CharacterTradeSocketEvents.MarketplaceTradeInit,
      {
        marketplaceId: testMarketplace._id,
        type: "sell",
        characterItems: [
          {
            ...Bow,
            price: Bow.basePrice * MARKETPLACE_SELL_PRICE_MULTIPLIER,
            stackQty: 2,
          },
          {
            ...arrow,
            price: arrow.basePrice * MARKETPLACE_SELL_PRICE_MULTIPLIER,
            stackQty: 100,
          },
        ],
        characterAvailableGold: 0,
      }
    );
  });

  it("should not invoke trade if marketplace does not exist", async () => {
    await characterTradingMarketplaceSell.initializeSell(testCharacter._id, testCharacter);

    expect(sendEventToUserOnInitSell).not.toBeCalled();

    expect(sendErrorMessageToCharacter).toBeCalled();
    expect(sendErrorMessageToCharacter).toHaveBeenLastCalledWith(
      testCharacter,
      "Sorry, the Marketplace you're trying to trade with is not available."
    );
  });

  it("should not invoke trade if marketplace is closed", async () => {
    testMarketplace.open = false;
    await testMarketplace.save();

    await characterTradingMarketplaceSell.initializeSell(testMarketplace._id, testCharacter);

    expect(sendEventToUserOnInitSell).not.toBeCalled();

    expect(sendErrorMessageToCharacter).toBeCalled();
    expect(sendErrorMessageToCharacter).toHaveBeenLastCalledWith(
      testCharacter,
      "Sorry, the Marketplace you're trying to trade with is not available."
    );
  });

  it("should return correct amount of gold in inventory", async () => {
    const items = [
      await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, { stackQty: 50 }),
      await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, { stackQty: 95 }),
    ];

    await unitTestHelper.addItemsToContainer(inventoryContainer, 6, items);

    await characterTradingMarketplaceSell.initializeSell(testMarketplace._id, testCharacter);

    expect(sendEventToUserOnInitSell).toBeCalled();

    expect(sendEventToUserOnInitSell).toHaveBeenLastCalledWith(
      testCharacter.channelId,
      CharacterTradeSocketEvents.MarketplaceTradeInit,
      {
        marketplaceId: testMarketplace._id,
        type: "sell",
        characterItems: [],
        characterAvailableGold: 145,
      }
    );
  });

  it("should not invoke trade if inventory does not exist", async () => {
    const equipment = await Equipment.findById(testCharacter.equipment);
    if (equipment) {
      equipment.inventory = undefined;
      await equipment.save();
    }

    await characterTradingMarketplaceSell.initializeSell(testMarketplace._id, testCharacter);

    expect(sendEventToUserOnInitSell).not.toBeCalled();

    expect(sendErrorMessageToCharacter).toBeCalled();
    expect(sendErrorMessageToCharacter).toHaveBeenLastCalledWith(
      testCharacter,
      "Oops! The character does not have an inventory."
    );
  });

  it("should not invoke trade if item container does not exist", async () => {
    const inventory = await testCharacter.inventory;
    if (inventory) {
      inventory.itemContainer = undefined;
      await inventory.save();
    }

    await characterTradingMarketplaceSell.initializeSell(testMarketplace._id, testCharacter);

    expect(sendEventToUserOnInitSell).not.toBeCalled();

    expect(sendErrorMessageToCharacter).toBeCalled();
    expect(sendErrorMessageToCharacter).toHaveBeenLastCalledWith(
      testCharacter,
      "Oops! The character does not have an inventory."
    );
  });

  it("should return no items if inventory is empty", async () => {
    await unitTestHelper.addItemsToContainer(inventoryContainer, 6, []);

    await characterTradingMarketplaceSell.initializeSell(testMarketplace._id, testCharacter);

    expect(sendEventToUserOnInitSell).toBeCalled();
    expect(sendErrorMessageToCharacter).not.toBeCalled();

    expect(sendEventToUserOnInitSell).toHaveBeenLastCalledWith(
      testCharacter.channelId,
      CharacterTradeSocketEvents.MarketplaceTradeInit,
      {
        marketplaceId: testMarketplace._id,
        type: "sell",
        characterItems: [],
        characterAvailableGold: 0,
      }
    );
  });

  it("should not return an item if it does not have a blueprint", async () => {
    const items = [
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Bow, {
        key: "invalid-Bow-key",
      }),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Bow),
    ];

    await unitTestHelper.addItemsToContainer(inventoryContainer, 6, items);

    await characterTradingMarketplaceSell.initializeSell(testMarketplace._id, testCharacter);

    expect(sendEventToUserOnInitSell).toBeCalled();
    expect(sendErrorMessageToCharacter).not.toBeCalled();

    const Bow = itemsBlueprintIndex[RangedWeaponsBlueprint.Bow];
    expect(sendEventToUserOnInitSell).toHaveBeenLastCalledWith(
      testCharacter.channelId,
      CharacterTradeSocketEvents.MarketplaceTradeInit,
      {
        marketplaceId: testMarketplace._id,
        type: "sell",
        characterItems: [
          {
            ...Bow,
            price: Bow.basePrice * MARKETPLACE_SELL_PRICE_MULTIPLIER,
            stackQty: 1,
          },
        ],
        characterAvailableGold: 0,
      }
    );
  });

  it("should not return an item if it does not have a sell price", async () => {
    const items = [
      await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, { stackQty: 10 }),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Bow),
    ];

    await unitTestHelper.addItemsToContainer(inventoryContainer, 6, items);

    await characterTradingMarketplaceSell.initializeSell(testMarketplace._id, testCharacter);

    expect(sendEventToUserOnInitSell).toBeCalled();
    expect(sendErrorMessageToCharacter).not.toBeCalled();

    const Bow = itemsBlueprintIndex[RangedWeaponsBlueprint.Bow];
    expect(sendEventToUserOnInitSell).toHaveBeenLastCalledWith(
      testCharacter.channelId,
      CharacterTradeSocketEvents.MarketplaceTradeInit,
      {
        marketplaceId: testMarketplace._id,
        type: "sell",
        characterItems: [
          {
            ...Bow,
            price: Bow.basePrice * MARKETPLACE_SELL_PRICE_MULTIPLIER,
            stackQty: 1,
          },
        ],
        characterAvailableGold: 10,
      }
    );
  });
});
