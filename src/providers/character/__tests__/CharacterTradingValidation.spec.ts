/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { PotionsBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { GRID_HEIGHT, GRID_WIDTH, ITradeRequestItem } from "@rpg-engine/shared";
import { CharacterTradingValidation } from "../CharacterTradingValidation";

describe("CharacterTradingValidation.ts", () => {
  let testCharacter: ICharacter;
  let testNPCTrader: INPC;
  let nonTraderNPC: INPC;
  let characterTradingValidation: CharacterTradingValidation;
  let sendErrorMessageToCharacter: jest.SpyInstance;
  let transactionItems: ITradeRequestItem[];

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    characterTradingValidation = container.get<CharacterTradingValidation>(CharacterTradingValidation);

    transactionItems = [
      {
        key: PotionsBlueprint.LightEndurancePotion,
        qty: 1,
      },
    ];
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter({
      x: 0,
      y: 0,
    });

    nonTraderNPC = await unitTestHelper.createMockNPC();

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
      ],
    });

    // @ts-ignore
    sendErrorMessageToCharacter = jest.spyOn(characterTradingValidation.socketMessaging, "sendErrorMessageToCharacter");
  });

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

    expect(sendErrorMessageToCharacter).toHaveBeenCalledWith(testCharacter, "You are too far away from the seller.");
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
      "Sorry, one of the items you are trying to buy is not available."
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

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
