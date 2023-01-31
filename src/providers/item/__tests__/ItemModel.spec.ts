/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { unitTestHelper } from "@providers/inversify/container";
import { itemMock } from "@providers/unitTests/mock/itemMock";
import { FromGridX, FromGridY } from "@rpg-engine/shared";

describe("ItemModel.ts", () => {
  let testCharacter: ICharacter;
  let testItem: IItem;
  let testItemArmor: IItem;

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(0),
      y: FromGridY(0),
    });
    testItem = await unitTestHelper.createMockItem({
      x: FromGridX(0),
      y: FromGridY(0),
      scene: testCharacter.scene,
      isItemContainer: true,
    });

    testItemArmor = await unitTestHelper.createMockArmor({
      x: FromGridX(0),
      y: FromGridY(0),
      scene: testCharacter.scene,
      isItemContainer: true,
    });
  });

  it("validate isEquipable, isStackable and fullDescription Item fields [ Attack/Defense/Weight ]", () => {
    const testItem = new Item({
      ...itemMock,
      _id: undefined,
      defense: 10,
      attack: 8,
    });

    expect(testItem.isEquipable).toBeTruthy();
    expect(testItem.maxStackSize > 1).toBeFalsy();
    expect(testItem.fullDescription).toBe(
      `${testItem.name}: ${testItem.description} Attack: ${testItem.attack}. Defense: ${testItem.defense}. Weight: ${testItem.weight}. Rarity: ${testItem.rarity}.`
    );
  });

  it("validate isEquipable, isStackable and fullDescription Item fields [ Defense/Weight ]", () => {
    expect(testItemArmor.isEquipable).toBeTruthy();
    expect(testItemArmor.maxStackSize > 1).toBeFalsy();
    expect(testItemArmor.fullDescription).toBe(
      `${testItemArmor.name}: ${testItemArmor.description} Defense: ${testItemArmor.defense}. Weight: ${testItemArmor.weight}. Rarity: ${testItemArmor.rarity}.`
    );
  });

  it("validate isEquipable, isStackable and fullDescription Item fields [ Attack/Weight ]", () => {
    expect(testItem.isEquipable).toBeTruthy();
    expect(testItem.maxStackSize > 1).toBeFalsy();
    expect(testItem.fullDescription).toBe(
      `${testItem.name}: ${testItem.description} Attack: ${testItem.attack}. Weight: ${testItem.weight}. Rarity: ${testItem.rarity}.`
    );
  });

  it("validate isEquipable, isStackable and fullDescription Item fields [ Weight ]", () => {
    const testItem = new Item({
      ...itemMock,
      _id: undefined,
      attack: undefined,
      defense: undefined,
    });

    expect(testItem.isEquipable).toBeTruthy();
    expect(testItem.maxStackSize > 1).toBeFalsy();
    expect(testItem.fullDescription).toBe(
      `${testItem.name}: ${testItem.description} Weight: ${testItem.weight}. Rarity: ${testItem.rarity}.`
    );
  });

  it("validate isEquipable, isStackable and fullDescription Item fields | stackable item", async () => {
    testItem = await unitTestHelper.createStackableMockItem({
      x: FromGridX(0),
      y: FromGridY(0),
      scene: testCharacter.scene,
    });

    expect(testItem.isEquipable).toBeTruthy();
    expect(testItem.maxStackSize > 1).toBeTruthy();
    expect(testItem.fullDescription).toBe(
      `${testItem.name}: ${testItem.description} Weight: ${testItem.weight}. Rarity: ${testItem.rarity}.`
    );
  });

  it("validate post save() Item methods are properly executed | add itemContainer and slots ", async () => {
    expect(testItem.itemContainer).toBeDefined();

    const itemContainer = await ItemContainer.findById(testItem.itemContainer);

    expect(itemContainer).toBeDefined();
    expect(itemContainer!.slotQty).toBe(20);
    expect(itemContainer!.name).toBe(testItem.name);
    expect(itemContainer!.parentItem.toString()).toBe(testItem._id.toString());
    expect(itemContainer!.slots).toBeDefined();
  });

  it("validate post remove() Item methods are properly executed | call warnAboutItemChanges and remove itemContainer ", async () => {
    await testItem.remove();

    expect(testItem.itemContainer).toBeDefined();

    const itemContainer = await ItemContainer.findById(testItem.itemContainer);
    const item = await Item.findById(testItem._id);

    expect(item).toBeNull();
    expect(itemContainer).toBeNull();
  });
});
