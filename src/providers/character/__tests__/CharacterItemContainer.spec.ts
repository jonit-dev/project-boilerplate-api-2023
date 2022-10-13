import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterItemContainer } from "../characterItems/CharacterItemContainer";

describe("CharacterItemContainer.ts", () => {
  let testCharacter: ICharacter;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;
  let characterItemContainer: CharacterItemContainer;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });

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

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
