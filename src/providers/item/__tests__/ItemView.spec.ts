/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
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

    expect(spyWarnCharactersAboutItemRemovalInView).toHaveBeenCalled();

    expect(testItem.x).toBe(undefined);
    expect(testItem.y).toBe(undefined);
    expect(testItem.scene).toBe(undefined);
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

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
