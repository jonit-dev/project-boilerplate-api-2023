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

  beforeAll(() => {
    characterTradingBalance = container.get<CharacterTradingBalance>(CharacterTradingBalance);
  });

  beforeEach(async () => {
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
        },
        {
          key: SwordsBlueprint.ShortSword,
          qty: 1,
        },
      ],
    });

    const transactionItems = [
      {
        key: PotionsBlueprint.LightEndurancePotion,
        qty: 1,
      },
      {
        key: SwordsBlueprint.ElvenSword, // this item is not in the NPC's traderItems. It's here on purpose, to test if the total price is calculated correctly
        qty: 1,
      },
    ];

    const totalPrice = await characterTradingBalance.calculateItemsTotalPrice(testNPC, transactionItems);

    expect(totalPrice).toBe(22.5);
  });
});
