import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterItemContainer } from "../characterItems/CharacterItemContainer";

describe("CharacterItemContainer.ts", () => {
  let testCharacter: ICharacter;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;
  let characterItemContainer: CharacterItemContainer;

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });

    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    characterItemContainer = container.get<CharacterItemContainer>(CharacterItemContainer);
  });

  it("should successfully remove an item from a container", async () => {
    const testItem = await unitTestHelper.createMockItem();

    await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 10, [testItem]);

    expect(inventoryContainer.slots[0]._id).toEqual(testItem._id);

    await characterItemContainer.removeItemFromContainer(testItem, testCharacter, inventoryContainer);

    const updatedInventoryContainer = (await ItemContainer.findById(
      inventoryContainer.id
    )) as unknown as IItemContainer;

    expect(updatedInventoryContainer.slots[0]).toBeNull();
  });

  it("should create a new item on the map, if you try to addItemToContainer but container is full", async () => {
    const testItem = await unitTestHelper.createMockItem();

    inventoryContainer.slotQty = 1;
    inventoryContainer.slots = {
      0: testItem.toJSON({ virtuals: true }),
    };
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    const anotherItem = await unitTestHelper.createMockItem();

    const result = await characterItemContainer.addItemToContainer(anotherItem, testCharacter, inventoryContainer._id);

    expect(result).toBe(true);

    const updatedAnotherItem = (await Item.findById(anotherItem._id)) as unknown as IItem;

    expect(updatedAnotherItem.x).toEqual(testCharacter.x);
    expect(updatedAnotherItem.y).toEqual(testCharacter.y);
    expect(updatedAnotherItem.scene).toEqual(testCharacter.scene);
  });
});
