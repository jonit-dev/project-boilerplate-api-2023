import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ContainersBlueprint } from "../data/types/itemsBlueprintTypes";
import { ItemOwnership } from "../ItemOwnership";

describe("ItemModel.ts", () => {
  let testCharacter: ICharacter;
  let backpack: IItem;
  let backpackContainer: IItemContainer;
  let itemOwnership: ItemOwnership;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemOwnership = container.get<ItemOwnership>(ItemOwnership);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter();

    backpack = await unitTestHelper.createMockItemFromBlueprint(ContainersBlueprint.Backpack);
    backpackContainer = (await ItemContainer.findById(backpack.itemContainer)) as unknown as IItemContainer;
  });

  it("should properly add item ownership", async () => {
    await itemOwnership.addItemOwnership(backpack, testCharacter);

    const updatedBackpack = await Item.findById(backpack._id);
    const updatedBackpackContainer = await ItemContainer.findById(backpackContainer._id);

    expect(updatedBackpack?.owner).toEqual(testCharacter._id);
    expect(updatedBackpackContainer?.owner).toEqual(testCharacter._id);
  });

  it("should properly remove item ownership", async () => {
    await itemOwnership.addItemOwnership(backpack, testCharacter);

    await itemOwnership.removeItemOwnership(backpack);

    const updatedBackpack = await Item.findById(backpack._id);
    const updatedBackpackContainer = await ItemContainer.findById(backpackContainer._id);

    expect(updatedBackpack?.owner).toBeNull();
    expect(updatedBackpackContainer?.owner).toBeNull();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
