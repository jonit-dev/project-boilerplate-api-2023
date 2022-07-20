/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SwordBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { CharacterView } from "../CharacterView";

describe("CharacterView.ts", () => {
  let characterView: CharacterView;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    characterView = container.get<CharacterView>(CharacterView);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(0),
      y: FromGridY(0),
    });
  });

  it("should properly get elements in char view", async () => {
    const blueprintData = itemsBlueprintIndex[SwordBlueprint.ShortSword];

    const shortSword = new Item({
      ...blueprintData,
      x: testCharacter.x,
      y: testCharacter.y,
      scene: testCharacter.scene,
    });

    await shortSword.save();

    const itemsInCharView: IItem[] = await characterView.getElementsInCharView(Item, testCharacter);

    expect(itemsInCharView.length).toBe(1);

    expect(itemsInCharView[0]._id).toEqual(shortSword._id);
  });

  it("should properly add a view element to the character view", async () => {
    const viewElement = {
      id: "testId",
      x: 1,
      y: 1,
      scene: "Example",
    };

    await characterView.addToCharacterView(testCharacter, viewElement, "items");

    expect(testCharacter.view.items).toEqual({
      [viewElement.id]: viewElement,
    });
  });

  it("should remove a view element from the character view", async () => {
    const viewElement = {
      id: "testId",
      x: 1,
      y: 1,
      scene: "Example",
    };

    await characterView.addToCharacterView(testCharacter, viewElement, "items");

    await characterView.removeFromCharacterView(testCharacter, "testId", "items");

    expect(testCharacter.view.items).toEqual({});
  });

  it("should fetch all characters around a XY position, and not the far away ones", async () => {
    const char2 = await unitTestHelper.createMockCharacter({
      id: "testId2",
      x: FromGridX(1),
      y: FromGridY(1),
    });
    const char3 = await unitTestHelper.createMockCharacter({
      id: "testId3",
      x: FromGridX(2),
      y: FromGridY(2),
    });
    const char4 = await unitTestHelper.createMockCharacter({
      id: "testId4",
      x: FromGridX(999),
      y: FromGridY(999),
    });

    const charactersAround = await characterView.getCharactersAroundXYPosition(FromGridX(0), FromGridY(0), "Example");

    expect(charactersAround).toHaveLength(3);

    // expect to have the test character
    expect(charactersAround.find((c) => c.id === testCharacter.id)).toBeTruthy();
    expect(charactersAround.find((c) => c.id === char2.id)).toBeTruthy();
    expect(charactersAround.find((c) => c.id === char3.id)).toBeTruthy();

    expect(charactersAround.find((c) => c.id === char4.id)).toBeFalsy();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
