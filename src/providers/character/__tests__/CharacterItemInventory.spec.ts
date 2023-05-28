import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Depot } from "@entities/ModuleDepot/DepotModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { OthersBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { Types } from "mongoose";
import { CharacterTradingBalance } from "../CharacterTradingBalance";
import { CharacterItemInventory } from "../characterItems/CharacterItemInventory";

describe("CharacterItemInventory.ts", () => {
  let characterItemInventory: CharacterItemInventory;
  let testCharacter: ICharacter;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;
  let characterTradingBalance: CharacterTradingBalance;

  beforeAll(() => {
    characterItemInventory = container.get<CharacterItemInventory>(CharacterItemInventory);
    characterTradingBalance = container.get<CharacterTradingBalance>(CharacterTradingBalance);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasInventory: true, hasEquipment: true });
    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;
  });

  afterEach(async () => {
    for (let i = 0; i < inventoryContainer.slotQty; i++) {
      inventoryContainer.slots[i] = null;
    }
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();
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

    await characterItemInventory.decrementItemFromInventoryByKey(OthersBlueprint.GoldCoin, testCharacter, 20);

    const newBalance = await characterTradingBalance.getTotalGoldInInventory(testCharacter);

    expect(newBalance).toBe(5);
  });

  it("should properly decrement a STACKABLE item from the inventory for decimal quantity", async () => {
    const goldCoins = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 2.3,
    });

    inventoryContainer.slots[0] = goldCoins.toJSON({ virtuals: true }); // if we dont do this, isStackable will be undefined, because its a virtual field!
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    await characterItemInventory.decrementItemFromInventoryByKey(OthersBlueprint.GoldCoin, testCharacter, 0.1);

    const newBalance = await characterTradingBalance.getTotalGoldInInventory(testCharacter);

    expect(newBalance).toBe(2.2);
  });

  it("should delete a STACKABLE item from the inventory if qty becomes zero", async () => {
    const goldCoins = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 25,
    });

    inventoryContainer.slots[0] = goldCoins.toJSON({ virtuals: true }); // if we dont do this, isStackable will be undefined, because its a virtual field!
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    await characterItemInventory.decrementItemFromInventoryByKey(OthersBlueprint.GoldCoin, testCharacter, 25);

    const updatedInventoryContainer = (await ItemContainer.findById(
      inventory.itemContainer
    )) as unknown as IItemContainer;

    expect(updatedInventoryContainer.slots[0]).toBe(null);

    const newBalance = await characterTradingBalance.getTotalGoldInInventory(testCharacter);
    expect(newBalance).toBe(0);

    // verify that item was also removed
    const item = await Item.findOne({ _id: goldCoins._id });
    expect(item).toBeNull();
  });

  it("should decrement first STACKABLE item from the inventory if multiple stacks of same item", async () => {
    const goldCoins1 = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 100,
    });
    const goldCoins2 = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 50,
    });

    inventoryContainer.slots[0] = goldCoins1.toJSON({ virtuals: true }); // if we dont do this, isStackable will be undefined, because its a virtual field!
    inventoryContainer.slots[1] = goldCoins2.toJSON({ virtuals: true });
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    await characterItemInventory.decrementItemFromInventoryByKey(OthersBlueprint.GoldCoin, testCharacter, 25);

    const updatedInventoryContainer = (await ItemContainer.findById(
      inventory.itemContainer
    )) as unknown as IItemContainer;
    expect(updatedInventoryContainer.slots[0]).not.toBe(null);
    expect(updatedInventoryContainer.slots[1]).not.toBe(null);

    expect(updatedInventoryContainer.slots[0].stackQty).toBe(75);
    expect(updatedInventoryContainer.slots[1].stackQty).toBe(50);

    const newBalance = await characterTradingBalance.getTotalGoldInInventory(testCharacter);
    expect(newBalance).toBe(125);
  });

  it("should remove first STACKABLE item and decrement from second if qty to decrement is more than qty of one stack", async () => {
    const goldCoins1 = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 100,
    });
    const goldCoins2 = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 50,
    });

    inventoryContainer.slots[0] = goldCoins1.toJSON({ virtuals: true }); // if we dont do this, isStackable will be undefined, because its a virtual field!
    inventoryContainer.slots[1] = goldCoins2.toJSON({ virtuals: true });
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    await characterItemInventory.decrementItemFromInventoryByKey(OthersBlueprint.GoldCoin, testCharacter, 125);

    const updatedInventoryContainer = (await ItemContainer.findById(
      inventory.itemContainer
    )) as unknown as IItemContainer;
    expect(updatedInventoryContainer.slots[0]).toBe(null);
    expect(updatedInventoryContainer.slots[1]).not.toBe(null);

    expect(updatedInventoryContainer.slots[1].stackQty).toBe(25);

    const newBalance = await characterTradingBalance.getTotalGoldInInventory(testCharacter);
    expect(newBalance).toBe(25);

    // verify that first item was also removed
    const item1 = await Item.findOne({ _id: goldCoins1._id });
    expect(item1).toBeNull();

    const item2 = await Item.findOne({ _id: goldCoins2._id });
    expect(item2).toBeDefined();
  });

  it("should properly decrement a NON-STACKABLE item from the inventory", async () => {
    const shortSword = await unitTestHelper.createMockItem();

    inventoryContainer.slots[0] = shortSword.toJSON({ virtuals: true }); // if we dont do this, isStackable will be undefined, because its a virtual field!
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    await characterItemInventory.decrementItemFromInventoryByKey(SwordsBlueprint.ShortSword, testCharacter, 1);

    const updatedInventoryContainer = (await ItemContainer.findById(
      inventory.itemContainer
    )) as unknown as IItemContainer;

    expect(updatedInventoryContainer.slots[0]).toBe(null);

    // verify that items were removed from database
    const item = await Item.findOne({ _id: shortSword._id });
    expect(item).toBeNull();
  });

  it("should properly decrement multiple NON-STACKABLE items from the inventory", async () => {
    const shortSword1 = await unitTestHelper.createMockItem();
    const shortSword2 = await unitTestHelper.createMockItem();

    inventoryContainer.slots[0] = shortSword1.toJSON({ virtuals: true }); // if we dont do this, isStackable will be undefined, because its a virtual field!
    inventoryContainer.slots[1] = shortSword2.toJSON({ virtuals: true });
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    await characterItemInventory.decrementItemFromInventoryByKey(SwordsBlueprint.ShortSword, testCharacter, 2);

    const updatedInventoryContainer = (await ItemContainer.findById(
      inventory.itemContainer
    )) as unknown as IItemContainer;

    expect(updatedInventoryContainer.slots[0]).toBe(null);
    expect(updatedInventoryContainer.slots[1]).toBe(null);

    // verify that items were removed from database
    const item1 = await Item.findOne({ _id: shortSword1._id });
    expect(item1).toBeNull();

    const item2 = await Item.findOne({ _id: shortSword2._id });
    expect(item2).toBeNull();
  });

  it("should properly decrement a NON-STACKABLE item from multiple same items in the inventory", async () => {
    const shortSword1 = await unitTestHelper.createMockItem();
    const shortSword2 = await unitTestHelper.createMockItem();

    inventoryContainer.slots[0] = shortSword1.toJSON({ virtuals: true }); // if we dont do this, isStackable will be undefined, because its a virtual field!
    inventoryContainer.slots[1] = shortSword2.toJSON({ virtuals: true });
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    await characterItemInventory.decrementItemFromInventoryByKey(SwordsBlueprint.ShortSword, testCharacter, 1);

    const updatedInventoryContainer = (await ItemContainer.findById(
      inventory.itemContainer
    )) as unknown as IItemContainer;

    expect(updatedInventoryContainer.slots[0]).toBe(null);
    expect(updatedInventoryContainer.slots[1]).not.toBe(null);
  });

  it("should properly check if an item exists on the inventory, by using a key", async () => {
    const shortSword = await unitTestHelper.createMockItem();

    inventoryContainer.slots[0] = shortSword.toJSON({ virtuals: true }); // if we dont do this, isStackable will be undefined, because its a virtual field!
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    const exists = !!(await characterItemInventory.checkItemInInventoryByKey(
      SwordsBlueprint.ShortSword,
      testCharacter
    ));
    const dontExist = !!(await characterItemInventory.checkItemInInventoryByKey(
      SwordsBlueprint.IceSword,
      testCharacter
    ));

    expect(exists).toBe(true);
    expect(dontExist).toBe(false);
  });

  it("should properly decrement all NON-STACKABLE item from multiple same items in NESTED containers", async () => {
    const shortSword1 = await unitTestHelper.createMockItem();
    const shortSword2 = await unitTestHelper.createMockItem();
    const shortSword3 = await unitTestHelper.createMockItem();

    // add sword item and abg to inventory container
    inventoryContainer = await unitTestHelper.addItemsToContainer(inventoryContainer, 1, [shortSword1]); // if we dont do this, isStackable will be undefined, because its a virtual field!
    let nestedCont1 = await unitTestHelper.addNestedContainer(testCharacter.id, inventoryContainer, 1);

    // add sword item to nested container
    nestedCont1 = await unitTestHelper.addItemsToContainer(nestedCont1, 1, [shortSword2]);
    const nestedCont2 = await unitTestHelper.addNestedContainer(testCharacter.id, nestedCont1, 1);

    // add sword item to nested container (level 2)
    await unitTestHelper.addItemsToContainer(nestedCont2, 1, [shortSword3]);

    const res = await characterItemInventory.decrementItemFromNestedInventoryByKey(
      SwordsBlueprint.ShortSword,
      testCharacter,
      3
    );
    expect(res.success).toBeTruthy();
    expect(res.updatedQty).toEqual(0);

    const updatedInventoryContainer = (await ItemContainer.findById(
      inventory.itemContainer
    )) as unknown as IItemContainer;

    const updatedNestedBagContainer1 = (await ItemContainer.findById(nestedCont1.id)) as unknown as IItemContainer;
    const updatedNestedBagContainer2 = (await ItemContainer.findById(nestedCont2.id)) as unknown as IItemContainer;

    expect(updatedInventoryContainer.slots[0]).toBe(null);
    expect(updatedInventoryContainer.slots[1]).not.toBe(null); // this is the nested bag
    expect(updatedNestedBagContainer1.slots[0]).toBe(null);
    expect(updatedNestedBagContainer1.slots[1]).not.toBe(null); // this is the nested bag
    expect(updatedNestedBagContainer2.slots[0]).toBe(null);
  });

  it("should delete a STACKABLE item from the inventory with NESTED containers if qty becomes zero", async () => {
    const goldCoins1 = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 25,
    });
    const goldCoins2 = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 25,
    });
    const goldCoins3 = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 25,
    });

    inventoryContainer = await unitTestHelper.addItemsToContainer(inventoryContainer, 1, [goldCoins1]);

    let nestedCont1 = await unitTestHelper.addNestedContainer(testCharacter.id, inventoryContainer, 1);
    nestedCont1 = await unitTestHelper.addItemsToContainer(nestedCont1, 1, [goldCoins2]);

    const nestedCont2 = await unitTestHelper.addNestedContainer(testCharacter.id, nestedCont1, 1);
    await unitTestHelper.addItemsToContainer(nestedCont2, 1, [goldCoins3]);

    const initialBalance = await characterTradingBalance.getTotalGoldInInventory(testCharacter);
    expect(initialBalance).toBe(75);

    const res = await characterItemInventory.decrementItemFromNestedInventoryByKey(
      OthersBlueprint.GoldCoin,
      testCharacter,
      75
    );
    expect(res.success).toBeTruthy();
    expect(res.updatedQty).toEqual(0);

    const updatedInventoryContainer = (await ItemContainer.findById(
      inventory.itemContainer
    )) as unknown as IItemContainer;

    const updatedBagCont1 = (await ItemContainer.findById(nestedCont1.id)) as unknown as IItemContainer;

    const updatedBagCont2 = (await ItemContainer.findById(nestedCont2.id)) as unknown as IItemContainer;

    expect(updatedInventoryContainer.slots[0]).toBe(null);
    expect(updatedInventoryContainer.slots[1]).not.toBe(null);
    expect(updatedBagCont1.slots[0]).toBe(null);
    expect(updatedBagCont1.slots[1]).not.toBe(null);
    expect(updatedBagCont2.slots[0]).toBe(null);

    const newBalance = await characterTradingBalance.getTotalGoldInInventory(testCharacter);
    expect(newBalance).toBe(0);

    // verify that items were also removed
    const item1 = await Item.findOne({ _id: goldCoins1._id });
    expect(item1).toBeNull();
    const item2 = await Item.findOne({ _id: goldCoins2._id });
    expect(item2).toBeNull();
    const item3 = await Item.findOne({ _id: goldCoins3._id });
    expect(item3).toBeNull();
  });

  it("should decrement first STACKABLE item from the inventory if multiple stacks of same item in NESTED containers", async () => {
    const goldCoins1 = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 100,
    });
    const goldCoins2 = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 50,
    });

    inventoryContainer = await unitTestHelper.addItemsToContainer(inventoryContainer, 1, [goldCoins1]);

    const nestedCont = await unitTestHelper.addNestedContainer(testCharacter.id, inventoryContainer, 1);
    await unitTestHelper.addItemsToContainer(nestedCont, 1, [goldCoins2]);

    const res = await characterItemInventory.decrementItemFromNestedInventoryByKey(
      OthersBlueprint.GoldCoin,
      testCharacter,
      25
    );
    expect(res.success).toBeTruthy();
    expect(res.updatedQty).toEqual(0);

    const updatedInventoryContainer = (await ItemContainer.findById(
      inventory.itemContainer
    )) as unknown as IItemContainer;

    const updatedNestedCont = (await ItemContainer.findById(nestedCont.id)) as unknown as IItemContainer;

    expect(updatedInventoryContainer.slots[0]).not.toBe(null);
    expect(updatedInventoryContainer.slots[1]).not.toBe(null);

    expect(updatedInventoryContainer.slots[0].stackQty).toBe(75);
    expect(updatedNestedCont.slots[0].stackQty).toBe(50);

    const newBalance = await characterTradingBalance.getTotalGoldInInventory(testCharacter);
    expect(newBalance).toBe(125);
  });

  it("should remove first STACKABLE item and decrement from second if qty to decrement is more than qty of one stack on NESTED containers", async () => {
    const goldCoins1 = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 100,
    });
    const goldCoins2 = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 50,
    });

    inventoryContainer = await unitTestHelper.addItemsToContainer(inventoryContainer, 1, [goldCoins1]);
    const nestedCont = await unitTestHelper.addNestedContainer(testCharacter.id, inventoryContainer, 1);
    await unitTestHelper.addItemsToContainer(nestedCont, 1, [goldCoins2]);

    const res = await characterItemInventory.decrementItemFromNestedInventoryByKey(
      OthersBlueprint.GoldCoin,
      testCharacter,
      125
    );
    expect(res.success).toBeTruthy();
    expect(res.updatedQty).toEqual(0);

    const updatedInventoryContainer = (await ItemContainer.findById(
      inventory.itemContainer
    )) as unknown as IItemContainer;
    const updatedNestedContainer = (await ItemContainer.findById(nestedCont.id)) as unknown as IItemContainer;

    expect(updatedInventoryContainer.slots[0]).toBe(null);
    expect(updatedInventoryContainer.slots[1]).not.toBe(null);

    expect(updatedNestedContainer.slots[0].stackQty).toBe(25);

    const newBalance = await characterTradingBalance.getTotalGoldInInventory(testCharacter);
    expect(newBalance).toBe(25);

    // verify that first item was also removed
    const item1 = await Item.findOne({ _id: goldCoins1._id });
    expect(item1).toBeNull();

    const item2 = await Item.findOne({ _id: goldCoins2._id });
    expect(item2).toBeDefined();
  });

  it("should remove first and second STACKABLE item on NESTED containers and updated qty (decrementQty) should be > 0", async () => {
    const goldCoins1 = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 100,
    });
    const goldCoins2 = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
      stackQty: 50,
    });

    inventoryContainer = await unitTestHelper.addItemsToContainer(inventoryContainer, 1, [goldCoins1]);
    const nestedCont = await unitTestHelper.addNestedContainer(testCharacter.id, inventoryContainer, 1);

    await unitTestHelper.addItemsToContainer(nestedCont, 1, [goldCoins2]);

    const res = await characterItemInventory.decrementItemFromNestedInventoryByKey(
      OthersBlueprint.GoldCoin,
      testCharacter,
      200
    );
    expect(res.success).toBeTruthy();
    expect(res.updatedQty).toEqual(50);

    const updatedInventoryContainer = (await ItemContainer.findById(
      inventory.itemContainer
    )) as unknown as IItemContainer;
    const updatedNestedContainer = (await ItemContainer.findById(nestedCont.id)) as unknown as IItemContainer;

    expect(updatedInventoryContainer.slots[0]).toBe(null);
    expect(updatedInventoryContainer.slots[1]).not.toBe(null);

    expect(updatedNestedContainer.slots[0]).toBe(null);

    const newBalance = await characterTradingBalance.getTotalGoldInInventory(testCharacter);
    expect(newBalance).toBe(0);

    // verify that first item was also removed
    const item1 = await Item.findOne({ _id: goldCoins1._id });
    expect(item1).toBeNull();

    const item2 = await Item.findOne({ _id: goldCoins2._id });
    expect(item2).toBeNull();
  });

  describe("Edge case - Depot x Inventory", () => {
    beforeEach(async () => {
      // create user depot

      let newDepot = new Depot({
        owner: Types.ObjectId(testCharacter._id),
        key: "banker",
      });

      newDepot = await newDepot.save();
      let depotItemContainer = new ItemContainer({
        parentItem: newDepot._id,
        name: "Depot",
        slotQty: 40,
      });
      depotItemContainer = await depotItemContainer.save();

      const shortSword = await unitTestHelper.createMockItem();

      depotItemContainer.slots[0] = shortSword.toJSON({ virtuals: true }); // if we dont do this, isStackable will be undefined, because its a virtual field!
      depotItemContainer.markModified("slots");
      await depotItemContainer.save();
    });

    it("should avoid taking into account character's depot item on item calculation", async () => {
      const goldCoins = await unitTestHelper.createMockItemFromBlueprint(OthersBlueprint.GoldCoin, {
        stackQty: 25,
      });

      inventoryContainer.slots[0] = goldCoins.toJSON({ virtuals: true }); // if we dont do this, isStackable will be undefined, because its a virtual field!
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      const items = await characterItemInventory.getAllItemsFromInventoryNested(testCharacter);

      expect(items.length).toBe(1);
    });
  });
});
