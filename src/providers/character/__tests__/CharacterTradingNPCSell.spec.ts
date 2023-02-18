/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TRADER_SELL_PRICE_MULTIPLIER } from "@providers/constants/ItemConstants";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import {
  AccessoriesBlueprint,
  OthersBlueprint,
  RangedWeaponsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterTradeSocketEvents, ItemSocketEvents, NPCMovementType } from "@rpg-engine/shared";
import { CharacterTradingNPCSell } from "../CharacterTradingNPCSell";
import { CharacterTradingValidation } from "../CharacterTradingValidation";
import { CharacterItemInventory } from "../characterItems/CharacterItemInventory";

describe("CharacterTradingNPCSell.ts", () => {
  let testCharacter: ICharacter;
  let testNPCTrader: INPC;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;

  let characterTradingNPCSell: CharacterTradingNPCSell;
  let sendErrorMessageToCharacter: jest.SpyInstance;
  let sendEventToUser: jest.SpyInstance;
  let validationMock: jest.SpyInstance;

  beforeAll(() => {
    characterTradingNPCSell = container.get<CharacterTradingNPCSell>(CharacterTradingNPCSell);
  });

  const addItemsToInventory = async () => {
    const items = [
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Slingshot),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Slingshot),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Arrow, { stackQty: 50 }),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Arrow, { stackQty: 50 }),
    ];

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, items);
  };

  const prepareData = async () => {
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
      traderItems: [],
    });

    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;
  };

  beforeEach(async () => {
    await prepareData();

    sendErrorMessageToCharacter = jest.spyOn(SocketMessaging.prototype, "sendErrorMessageToCharacter");
    sendErrorMessageToCharacter.mockImplementation();

    sendEventToUser = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");

    validationMock = jest.spyOn(CharacterTradingValidation.prototype, "validateSellTransaction");
    validationMock.mockImplementation();
    validationMock.mockReturnValue(Promise.resolve(true));

    await addItemsToInventory();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should successfully sell stackable and non stackable items", async () => {
    await characterTradingNPCSell.sellItemsToNPC(testCharacter, testNPCTrader, [
      {
        key: RangedWeaponsBlueprint.Slingshot,
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
    expect(updatedContainer.slots[0].stackQty).toBe(29.5);

    expect(updatedContainer.slots[2]).not.toBeNull();
    expect(updatedContainer.slots[2].key).toBe(RangedWeaponsBlueprint.Arrow);
    expect(updatedContainer.slots[2].stackQty).toBe(40);

    expect(sendErrorMessageToCharacter).not.toBeCalled();
    expect(sendEventToUser).toBeCalledTimes(2);

    expect(sendEventToUser).toHaveBeenCalledWith(
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
        key: RangedWeaponsBlueprint.Slingshot,
        qty: 1,
      },
      {
        key: RangedWeaponsBlueprint.Arrow,
        qty: 10,
      },
    ];

    await characterTradingNPCSell.sellItemsToNPC(testCharacter, testNPCTrader, sellItems);

    const updatedContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    expect(updatedContainer.slots[0]).not.toBeNull();
    expect(updatedContainer.slots[0].key).toBe(RangedWeaponsBlueprint.Slingshot);

    expect(updatedContainer.slots[2]).not.toBeNull();
    expect(updatedContainer.slots[2].key).toBe(RangedWeaponsBlueprint.Arrow);
    expect(updatedContainer.slots[2].stackQty).toBe(50);

    expect(sendErrorMessageToCharacter).not.toBeCalled();
    expect(sendEventToUser).not.toBeCalled();

    expect(validationMock).toBeCalled();
    expect(validationMock).toBeCalledWith(testCharacter, testNPCTrader, sellItems);
  });

  it("should merge duplicate items qty before passing to validation", async () => {
    const sellItems = [
      {
        key: RangedWeaponsBlueprint.Slingshot,
        qty: 1,
      },
      {
        key: RangedWeaponsBlueprint.Slingshot,
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

    await characterTradingNPCSell.sellItemsToNPC(testCharacter, testNPCTrader, sellItems);

    expect(validationMock).toBeCalled();
    expect(validationMock).toBeCalledWith(testCharacter, testNPCTrader, [
      {
        key: RangedWeaponsBlueprint.Slingshot,
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

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, items);

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

    await characterTradingNPCSell.sellItemsToNPC(testCharacter, testNPCTrader, sellItems);

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

    await characterTradingNPCSell.sellItemsToNPC(testCharacter, testNPCTrader, sellItems);

    const updatedContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;
    expect(updatedContainer.slots[0].key).toBe(RangedWeaponsBlueprint.Slingshot);
    expect(updatedContainer.slots[1].key).toBe(RangedWeaponsBlueprint.Slingshot);

    expect(updatedContainer.slots[2].key).toBe(RangedWeaponsBlueprint.Arrow);
    expect(updatedContainer.slots[2].stackQty).toBe(50);
    expect(updatedContainer.slots[3].key).toBe(RangedWeaponsBlueprint.Arrow);

    expect(updatedContainer.slots[4]).toBeUndefined();

    expect(sendErrorMessageToCharacter).not.toBeCalled();
    expect(sendEventToUser).not.toBeCalled();
  });

  it("should do no further processing if no items were sold", async () => {
    const decrementMock = jest.spyOn(CharacterItemInventory.prototype, "decrementItemFromInventoryByKey");
    decrementMock.mockImplementation();
    decrementMock.mockReturnValue(Promise.resolve(false));

    await characterTradingNPCSell.sellItemsToNPC(testCharacter, testNPCTrader, [
      {
        key: RangedWeaponsBlueprint.Slingshot,
        qty: 1,
      },
    ]);

    const updatedContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;
    expect(updatedContainer.slots[0].key).toBe(RangedWeaponsBlueprint.Slingshot);
    expect(updatedContainer.slots[1].key).toBe(RangedWeaponsBlueprint.Slingshot);

    expect(updatedContainer.slots[2].key).toBe(RangedWeaponsBlueprint.Arrow);
    expect(updatedContainer.slots[2].stackQty).toBe(50);
    expect(updatedContainer.slots[3].key).toBe(RangedWeaponsBlueprint.Arrow);

    expect(updatedContainer.slots[4]).toBeUndefined();

    expect(sendErrorMessageToCharacter).not.toBeCalled();
    expect(sendEventToUser).not.toBeCalled();
  });

  it("should create two gold items if more gold earned than max stack size", async () => {
    const sellItems = [
      {
        key: RangedWeaponsBlueprint.Slingshot,
        qty: 2,
      },
      {
        key: RangedWeaponsBlueprint.Arrow,
        qty: 150,
      },
    ];

    await characterTradingNPCSell.sellItemsToNPC(testCharacter, testNPCTrader, sellItems);

    const updatedContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    expect(updatedContainer.slots[0]).not.toBeNull();
    expect(updatedContainer.slots[0].key).toBe(OthersBlueprint.GoldCoin);
    expect(updatedContainer.slots[0].stackQty).toBe(124);

    expect(updatedContainer.slots[1]).toBeNull();
    expect(updatedContainer.slots[2]).toBeNull();
    expect(updatedContainer.slots[3]).toBeNull();
  });

  it("should add gold to existing stack if possible", async () => {
    const items = [
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Slingshot),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Slingshot),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Arrow, { stackQty: 50 }),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Arrow, { stackQty: 50 }),
      await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, { stackQty: 10 }),
    ];

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, items);

    const sellItems = [
      {
        key: RangedWeaponsBlueprint.Slingshot,
        qty: 2,
      },
      {
        key: RangedWeaponsBlueprint.Arrow,
        qty: 100,
      },
    ];

    await characterTradingNPCSell.sellItemsToNPC(testCharacter, testNPCTrader, sellItems);

    const updatedContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    expect(updatedContainer.slots[4]).not.toBeNull();
    expect(updatedContainer.slots[4].key).toBe(OthersBlueprint.GoldCoin);
    expect(updatedContainer.slots[4].stackQty).toBe(109);

    expect(updatedContainer.slots[0]).toBeNull();
    expect(updatedContainer.slots[1]).toBeNull();
    expect(updatedContainer.slots[2]).toBeNull();
    expect(updatedContainer.slots[3]).toBeNull();
  });

  it("should return items to be sold", async () => {
    await characterTradingNPCSell.initializeSell(testNPCTrader._id, testCharacter);

    expect(sendEventToUser).toBeCalled();

    const slingShot = itemsBlueprintIndex[RangedWeaponsBlueprint.Slingshot];
    const arrow = itemsBlueprintIndex[RangedWeaponsBlueprint.Arrow];

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, CharacterTradeSocketEvents.TradeInit, {
      npcId: testNPCTrader._id,
      type: "sell",
      characterItems: [
        {
          key: slingShot.key,
          price: slingShot.basePrice * TRADER_SELL_PRICE_MULTIPLIER,
          name: slingShot.name,
          texturePath: slingShot.texturePath,
          qty: 2,
        },
        {
          key: arrow.key,
          price: arrow.basePrice * TRADER_SELL_PRICE_MULTIPLIER,
          name: arrow.name,
          texturePath: arrow.texturePath,
          qty: 100,
        },
      ],
      characterAvailableGold: 0,
    });
  });

  it("should stop npc movement and set character as target", async () => {
    expect(testNPCTrader.currentMovementType).toBe(NPCMovementType.Random);
    expect(testNPCTrader.targetCharacter).not.toBeDefined();

    await characterTradingNPCSell.initializeSell(testNPCTrader._id, testCharacter);

    const latest = (await NPC.findById(testNPCTrader._id)) as unknown as INPC;
    expect(latest.currentMovementType).toBe(NPCMovementType.Stopped);
    expect(latest.targetCharacter).toStrictEqual(testCharacter._id);
  });

  it("should not invoke trade if npc does not exist", async () => {
    await characterTradingNPCSell.initializeSell(testCharacter._id, testCharacter);

    expect(sendEventToUser).not.toBeCalled();

    expect(sendErrorMessageToCharacter).toBeCalled();
    expect(sendErrorMessageToCharacter).toHaveBeenLastCalledWith(
      testCharacter,
      "Sorry, the NPC you're trying to trade with is not available."
    );
  });

  it("should not invoke trade if npc is not a trader", async () => {
    testNPCTrader.isTrader = false;
    await testNPCTrader.save();

    await characterTradingNPCSell.initializeSell(testNPCTrader._id, testCharacter);

    expect(sendEventToUser).not.toBeCalled();

    expect(sendErrorMessageToCharacter).toBeCalled();
    expect(sendErrorMessageToCharacter).toHaveBeenLastCalledWith(
      testCharacter,
      "Sorry, the NPC you're trying to trade with is not a trader."
    );
  });

  it("should return correct amount of gold in inventory", async () => {
    const items = [
      await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, { stackQty: 50 }),
      await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, { stackQty: 95 }),
    ];

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, items);

    await characterTradingNPCSell.initializeSell(testNPCTrader._id, testCharacter);

    expect(sendEventToUser).toBeCalled();

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, CharacterTradeSocketEvents.TradeInit, {
      npcId: testNPCTrader._id,
      type: "sell",
      characterItems: [],
      characterAvailableGold: 145,
    });
  });

  it("should not invoke trade if inventory does not exist", async () => {
    const equipment = await Equipment.findById(testCharacter.equipment);
    if (equipment) {
      equipment.inventory = undefined;
      await equipment.save();
    }

    await characterTradingNPCSell.initializeSell(testNPCTrader._id, testCharacter);

    expect(sendEventToUser).not.toBeCalled();

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

    await characterTradingNPCSell.initializeSell(testNPCTrader._id, testCharacter);

    expect(sendEventToUser).not.toBeCalled();

    expect(sendErrorMessageToCharacter).toBeCalled();
    expect(sendErrorMessageToCharacter).toHaveBeenLastCalledWith(
      testCharacter,
      "Oops! The character does not have an inventory."
    );
  });

  it("should return no items if inventory is empty", async () => {
    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, []);

    await characterTradingNPCSell.initializeSell(testNPCTrader._id, testCharacter);

    expect(sendEventToUser).toBeCalled();
    expect(sendErrorMessageToCharacter).not.toBeCalled();

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, CharacterTradeSocketEvents.TradeInit, {
      npcId: testNPCTrader._id,
      type: "sell",
      characterItems: [],
      characterAvailableGold: 0,
    });
  });

  it("should not return an item if it does not have a blueprint", async () => {
    const items = [
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Slingshot, {
        key: "invalid-slingshot-key",
      }),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Slingshot),
    ];

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, items);

    await characterTradingNPCSell.initializeSell(testNPCTrader._id, testCharacter);

    expect(sendEventToUser).toBeCalled();
    expect(sendErrorMessageToCharacter).not.toBeCalled();

    const slingShot = itemsBlueprintIndex[RangedWeaponsBlueprint.Slingshot];
    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, CharacterTradeSocketEvents.TradeInit, {
      npcId: testNPCTrader._id,
      type: "sell",
      characterItems: [
        {
          key: slingShot.key,
          price: slingShot.basePrice * TRADER_SELL_PRICE_MULTIPLIER,
          name: slingShot.name,
          texturePath: slingShot.texturePath,
          qty: 1,
        },
      ],
      characterAvailableGold: 0,
    });
  });

  it("should not return an item if it does not have a sell price", async () => {
    const items = [
      await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, { stackQty: 10 }),
      await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Slingshot),
    ];

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 6, items);

    await characterTradingNPCSell.initializeSell(testNPCTrader._id, testCharacter);

    expect(sendEventToUser).toBeCalled();
    expect(sendErrorMessageToCharacter).not.toBeCalled();

    const slingShot = itemsBlueprintIndex[RangedWeaponsBlueprint.Slingshot];
    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, CharacterTradeSocketEvents.TradeInit, {
      npcId: testNPCTrader._id,
      type: "sell",
      characterItems: [
        {
          key: slingShot.key,
          price: slingShot.basePrice * TRADER_SELL_PRICE_MULTIPLIER,
          name: slingShot.name,
          texturePath: slingShot.texturePath,
          qty: 1,
        },
      ],
      characterAvailableGold: 10,
    });
  });
});
