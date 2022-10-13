import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { OthersBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CharacterItemInventory } from "../characterItems/CharacterItemInventory";
import { CharacterTradingBalance } from "../CharacterTradingBalance";

describe("CharacterItemInventory.ts", () => {
  let characterItemInventory: CharacterItemInventory;
  let testCharacter: ICharacter;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;
  let characterTradingBalance: CharacterTradingBalance;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    characterItemInventory = container.get<CharacterItemInventory>(CharacterItemInventory);
    characterTradingBalance = container.get<CharacterTradingBalance>(CharacterTradingBalance);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter(null, { hasInventory: true, hasEquipment: true });
    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;
  });

  it("should properly get the item in the inventory slot", async () => {
    await characterItemInventory.addEquipmentToCharacter(testCharacter);

    const inventory = await testCharacter.inventory;

    expect(inventory.name).toBe("Backpack");
  });

  it("should properly decrement a STACKABLE item from the inventory", async () => {
    const goldCoins = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 25,
    });

    inventoryContainer.slots[0] = goldCoins.toJSON({ virtuals: true }); // if we dont do this, isStackable will be undefined, because its a virtual field!
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    await characterItemInventory.decrementItemFromInventory(OthersBlueprint.GoldCoin, testCharacter, 20);

    const newBalance = await characterTradingBalance.getTotalGoldInInventory(testCharacter);

    expect(newBalance).toBe(5);
  });
  it("should properly decrement a NON-STACKABLE item from the inventory", async () => {
    const shortSword = await unitTestHelper.createMockItem();

    inventoryContainer.slots[0] = shortSword.toJSON({ virtuals: true }); // if we dont do this, isStackable will be undefined, because its a virtual field!
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    await characterItemInventory.decrementItemFromInventory(SwordsBlueprint.ShortSword, testCharacter, 1);

    const updatedInventoryContainer = (await ItemContainer.findById(
      inventory.itemContainer
    )) as unknown as IItemContainer;

    expect(updatedInventoryContainer.slots[0]).toBe(null);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
