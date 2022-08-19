/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { ItemView } from "../ItemView";

describe("ItemView.ts", () => {
  let testCharacter: ICharacter;
  let testItem: IItem;
  let itemView: ItemView;
  let spyWarnCharactersAboutItemRemovalInView: any;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemView = container.get<ItemView>(ItemView);

    spyWarnCharactersAboutItemRemovalInView = jest.spyOn(itemView, "warnCharactersAboutItemRemovalInView" as any);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
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
  });

  it("should properly remove item x, y and scene after calling the method removeItemFromMap", async () => {
    await itemView.removeItemFromMap(testItem);

    const item = await Item.findById(testItem.id);

    if (!item) {
      throw new Error("Item not found.");
    }

    expect(spyWarnCharactersAboutItemRemovalInView).toHaveBeenCalled();

    expect(item.x).toBe(null);
    expect(item.y).toBe(null);
    expect(item.scene).toBe(null);
  });

  it("should get one item after calling the method getItemsInCharacterView", async () => {
    const items = await itemView.getItemsInCharacterView(testCharacter);

    expect(items).toBeDefined();
    expect(items.length).toBe(1);
    expect(items[0]._id.toString()).toBe(testItem._id.toString());
    expect(items[0].description).toBe(testItem.description);
  });

  it("should add item in character's view when calling warnCharacterAboutItemsInView and remove it when calling the method warnCharactersAboutItemRemovalInView", async () => {
    await itemView.warnCharacterAboutItemsInView(testCharacter);

    expect(testCharacter.view.items[testItem._id]).toBeDefined();

    await itemView.warnCharactersAboutItemRemovalInView(testItem, testItem.x!, testItem.y!, testItem.scene!);

    const character = await Character.findById(testCharacter._id);

    expect(character!.view.items[testItem._id]).not.toBeDefined();
  });

  it("should throw error if a we try to remove an item from a map without a scene", async () => {
    try {
      testItem.scene = undefined;
      await itemView.removeItemFromMap(testItem);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty("message", "You cannot call this method without an item x, y and scene.");
    }
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
