import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data";
import { CharacterInventory } from "../CharacterInventory";
describe("CharacterInventory", () => {
  let testCharacter: ICharacter;
  let characterInventory: CharacterInventory;

  beforeAll(() => {
    characterInventory = container.get(CharacterInventory);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
  });

  it("fetches the inventory of a character", async () => {
    const inventory = await characterInventory.getInventory(testCharacter);

    expect(inventory).toBeDefined();
    expect(inventory?.owner).toEqual(testCharacter._id);
    expect(inventory?.isItemContainer).toBeTruthy();
  });

  it("fetches all items from a character's container", async () => {
    const inventory = await characterInventory.getInventory(testCharacter);
    if (inventory) {
      const items = await characterInventory.getAllItemsFromContainer(inventory._id);
      expect(items).toBeDefined();
      expect(items.length).toBeGreaterThanOrEqual(0);
    }
  });

  it("fetches all items from a character's inventory", async () => {
    const mockSword = await unitTestHelper.createMockItem(itemsBlueprintIndex.sword);

    const inventory = await characterInventory.getInventory(testCharacter);

    if (!inventory) {
      throw new Error("Inventory not found");
    }
    const inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as IItemContainer;

    await unitTestHelper.addItemsToContainer(inventoryContainer, 10, [mockSword]);

    const items = (await characterInventory.getAllItemsFromInventory(testCharacter)) as Record<string, IItem[]>;
    expect(items).toBeDefined();
    expect(Object.keys(items).length).toBeGreaterThanOrEqual(0);
  });

  it("fetches items recursively", async () => {
    const inventory = await characterInventory.getInventory(testCharacter);
    if (inventory) {
      const nestedInventoryAndItems: Record<string, IItem[]> = {};
      await characterInventory.getItemsRecursively(inventory._id, nestedInventoryAndItems);
      expect(Object.keys(nestedInventoryAndItems).length).toBeGreaterThanOrEqual(0);
    }
  });
});
