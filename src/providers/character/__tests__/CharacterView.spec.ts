/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
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

  it("should properly add a view element to the character view", async () => {
    const viewElement = {
      id: "testId",
      x: 1,
      y: 1,
      scene: "example",
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
      scene: "example",
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

    const charactersAround = await characterView.getCharactersAroundXYPosition(FromGridX(0), FromGridY(0), "example");

    expect(charactersAround).toHaveLength(3);

    // expect to have the test character
    expect(charactersAround.find((c) => c.id === testCharacter.id)).toBeTruthy();
    expect(charactersAround.find((c) => c.id === char2.id)).toBeTruthy();
    expect(charactersAround.find((c) => c.id === char3.id)).toBeTruthy();

    expect(charactersAround.find((c) => c.id === char4.id)).toBeFalsy();
  });

  it("should properly get elements in char view", async () => {
    const blueprintData = itemsBlueprintIndex[SwordsBlueprint.ShortSword];

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

  it("should return true when checking if an element is on character view and it is", async () => {
    const viewElement = {
      id: "testId",
      x: 1,
      y: 1,
      scene: "example",
    };
    await characterView.addToCharacterView(testCharacter, viewElement, "items");
    const isOnView = characterView.isOnCharacterView(testCharacter, "testId", "items");
    expect(isOnView).toBeTruthy();
  });

  it("should return false when checking if an element is on character view and it isn't", async () => {
    const viewElement = {
      id: "testId",
      x: 1,
      y: 1,
      scene: "example",
    };
    await characterView.addToCharacterView(testCharacter, viewElement, "items");
    const isOnView = characterView.isOnCharacterView(testCharacter, "testId2", "items");
    expect(isOnView).toBeFalsy();
  });

  it("should return undefined when trying to get nearest characters and there are no characters around", async () => {
    await testCharacter.delete();

    const nearestChar = await characterView.getNearestCharactersFromXYPoint(FromGridX(999), FromGridY(999), "example");
    expect(nearestChar).toBeNull();
  });

  it("should return the nearest character even if it is not alive", async () => {
    await testCharacter.delete();

    const char2 = await unitTestHelper.createMockCharacter({
      id: "testId2",
      x: FromGridX(1),
      y: FromGridY(1),
      isAlive: false,
    });
    await unitTestHelper.createMockCharacter({
      id: "testId3",
      x: FromGridX(2),
      y: FromGridY(2),
    });
    await unitTestHelper.createMockCharacter({
      id: "testId4",
      x: FromGridX(3),
      y: FromGridY(3),
    });

    const nearestChar = await characterView.getNearestCharactersFromXYPoint(FromGridX(0), FromGridY(0), "example");
    expect(nearestChar?._id).toEqual(char2._id);
  });

  it("should clear elements that are out of the character's view", async () => {
    const viewElement1 = {
      id: "testId1",
      x: FromGridX(2),
      y: FromGridY(2),
      scene: "example",
    };
    const viewElement2 = {
      id: "testId2",
      x: FromGridX(3),
      y: FromGridY(3),
      scene: "example",
    };

    await characterView.addToCharacterView(testCharacter, viewElement1, "items");
    await characterView.addToCharacterView(testCharacter, viewElement2, "items");

    testCharacter.x = FromGridX(999);
    testCharacter.y = FromGridY(999);
    await testCharacter.save();

    await characterView.clearOutOfViewElements(testCharacter, "items");

    const updatedTestCharacter = await Character.findById(testCharacter._id);

    if (!updatedTestCharacter) throw new Error("Character not found");

    expect(updatedTestCharacter.view.items).toEqual({});
  });

  it("should clear elements of all types that are out of the character's view", async () => {
    const viewElement1 = {
      id: "testId1",
      x: FromGridX(2),
      y: FromGridY(2),
      scene: "example",
    };
    const viewElement2 = {
      id: "testId2",
      x: FromGridX(3),
      y: FromGridY(3),
      scene: "example",
    };
    const viewElement3 = {
      id: "testId3",
      x: FromGridX(4),
      y: FromGridY(4),
      scene: "example",
    };

    await characterView.addToCharacterView(testCharacter, viewElement1, "items");
    await characterView.addToCharacterView(testCharacter, viewElement2, "npcs");
    await characterView.addToCharacterView(testCharacter, viewElement3, "characters");

    testCharacter.x = FromGridX(999);
    testCharacter.y = FromGridY(999);
    await testCharacter.save();

    await characterView.clearOutOfViewElementsAll(testCharacter);

    const updatedTestCharacter = await Character.findById(testCharacter._id);

    if (!updatedTestCharacter) {
      throw new Error("Character not found");
    }

    expect(updatedTestCharacter.view.items).toEqual({});
    expect(updatedTestCharacter.view.npcs).toEqual({});
    expect(updatedTestCharacter.view.characters).toEqual({});
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
