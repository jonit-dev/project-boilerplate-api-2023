import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ItemUpdater } from "../ItemUpdater";
import { ContainersBlueprint, SwordsBlueprint } from "../data/types/itemsBlueprintTypes";

describe("ItemUpdater", () => {
  let itemUpdater: ItemUpdater;
  let testCharacter: ICharacter;
  let testBag: IItem;
  let testSword: IItem;

  beforeAll(() => {
    itemUpdater = container.get(ItemUpdater);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter();

    testBag = await unitTestHelper.createMockItemFromBlueprint(ContainersBlueprint.Backpack);

    testSword = await unitTestHelper.createMockItemFromBlueprint(SwordsBlueprint.Sword);
  });

  it("should properly update an item recursively", async () => {
    const testBagItemContainer = (await ItemContainer.findById(testBag.itemContainer)) as IItemContainer;
    testBagItemContainer.slots = {
      ...testBagItemContainer.slots,
      0: testSword,
    };
    await testBagItemContainer.save();

    await itemUpdater.updateItemRecursivelyIfNeeded(testBag, {
      $set: {
        isInDepot: true,
      },
    });

    const updatedBag = await Item.findById(testBag._id).lean().select("isInDepot");

    expect(updatedBag?.isInDepot).toBe(true);

    const updatedSword = await Item.findById(testSword._id).lean().select("isInDepot");

    expect(updatedSword?.isInDepot).toBe(true);
  });
});
