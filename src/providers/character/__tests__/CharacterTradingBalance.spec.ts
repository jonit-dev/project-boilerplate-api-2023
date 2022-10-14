/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { OthersBlueprint, PotionsBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CharacterTradingBalance } from "../CharacterTradingBalance";

describe("CharacterTradingBalance.ts", () => {
  let testCharacter: ICharacter;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;
  let characterTradingBalance: CharacterTradingBalance;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    characterTradingBalance = container.get<CharacterTradingBalance>(CharacterTradingBalance);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasInventory: true,

      hasEquipment: true,
    });
    inventory = await testCharacter.inventory;

    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;
  });

  it("should properly count all available gold on character inventory", async () => {
    const goldCoins = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 25,
    });

    inventoryContainer.slots[0] = goldCoins;
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    const balance = await characterTradingBalance.getTotalGoldInInventory(testCharacter);

    expect(balance).toBe(25);
  });

  it("should calculate the items total price for a transaction", async () => {
    const testNPC = await unitTestHelper.createMockNPC({
      isTrader: true,
      traderItems: [
        {
          key: PotionsBlueprint.LightEndurancePotion,
          qty: 1,
          price: 15,
        },
        {
          key: SwordsBlueprint.ShortSword,
          qty: 1,
          price: 50,
        },
      ],
    });

    const transactionItems = [
      {
        key: PotionsBlueprint.LightEndurancePotion,
        qty: 1,
        price: 15,
      },
      {
        key: SwordsBlueprint.ElvenSword, // this item is not in the NPC's traderItems. It's here on purpuse, to test if the total price is calculated correctly
        qty: 1,
        price: 500,
      },
    ];

    const totalPrice = await characterTradingBalance.calculateItemsTotalPrice(testNPC, transactionItems);

    expect(totalPrice).toBe(15);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
