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

  beforeAll(() => {
    characterView = container.get<CharacterView>(CharacterView);
  });

  beforeEach(async () => {
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

    await characterView.addToCharacterView(testCharacter._id, viewElement, "items");

    const hasItems = await characterView.hasElementOnView(testCharacter, "testId", "items");

    expect(hasItems).toEqual(true);
  });

  it("should remove a view element from the character view", async () => {
    const viewElement = {
      id: "testId",
      x: 1,
      y: 1,
      scene: "example",
    };

    await characterView.addToCharacterView(testCharacter._id, viewElement, "items");

    await characterView.removeFromCharacterView(testCharacter._id, "testId", "items");

    const hasItems = await characterView.hasElementOnView(testCharacter, "testId", "items");

    expect(hasItems).toEqual(false);
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
    await characterView.addToCharacterView(testCharacter._id, viewElement, "items");
    const isOnView = await characterView.isOnCharacterView(testCharacter._id, "testId", "items");
    expect(isOnView).toBeTruthy();
  });

  it("should return false when checking if an element is on character view and it isn't", async () => {
    const viewElement = {
      id: "testId",
      x: 1,
      y: 1,
      scene: "example",
    };
    await characterView.addToCharacterView(testCharacter._id, viewElement, "items");
    const isOnView = await characterView.isOnCharacterView(testCharacter._id, "testId2", "items");
    expect(isOnView).toBeFalsy();
  });

  it("checks if has element on view", async () => {
    const viewElement = {
      id: "testId",
      x: 1,
      y: 1,
      scene: "example",
    };
    await characterView.addToCharacterView(testCharacter._id, viewElement, "items");
    const hasElement = await characterView.hasElementOnView(testCharacter, viewElement.id, "items");
    expect(hasElement).toBeTruthy();
  });

  it("gets an element on the character view", async () => {
    const viewElement = {
      id: "testId",
      x: 1,
      y: 1,
      scene: "example",
    };
    await characterView.addToCharacterView(testCharacter._id, viewElement, "items");
    const element = await characterView.getElementOnView(testCharacter, viewElement.id, "items");
    expect(element).toBeTruthy();
    expect(element).toMatchObject(viewElement);
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

    await characterView.addToCharacterView(testCharacter._id, viewElement1, "items");
    await characterView.addToCharacterView(testCharacter._id, viewElement2, "items");

    testCharacter.x = FromGridX(999);
    testCharacter.y = FromGridY(999);
    await testCharacter.save();

    await characterView.clearOutOfViewElements(testCharacter._id, testCharacter.x, testCharacter.y, "items");

    const updatedTestCharacter = await Character.findById(testCharacter._id);

    if (!updatedTestCharacter) throw new Error("Character not found");

    const hasTestId1 = await characterView.hasElementOnView(updatedTestCharacter, "testId1", "items");
    const hasTestId2 = await characterView.hasElementOnView(updatedTestCharacter, "testId2", "items");

    expect(hasTestId1).toEqual(false);
    expect(hasTestId2).toEqual(false);
  });

  it("properly adds multiple elements in a view as a batch", async () => {
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

    await characterView.batchAddToCharacterView(testCharacter._id, [viewElement1, viewElement2], "items");

    const hasTestId1 = await characterView.hasElementOnView(testCharacter, "testId1", "items");
    const hasTestId2 = await characterView.hasElementOnView(testCharacter, "testId2", "items");

    expect(hasTestId1).toEqual(true);
    expect(hasTestId2).toEqual(true);
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

    await characterView.addToCharacterView(testCharacter._id, viewElement1, "items");
    await characterView.addToCharacterView(testCharacter._id, viewElement2, "npcs");
    await characterView.addToCharacterView(testCharacter._id, viewElement3, "characters");

    testCharacter.x = FromGridX(999);
    testCharacter.y = FromGridY(999);
    await testCharacter.save();

    const characterViewItems = await characterView.getAllElementsOnView(testCharacter, "items");
    const characterViewNpcs = await characterView.getAllElementsOnView(testCharacter, "npcs");
    const characterViewCharacters = await characterView.getAllElementsOnView(testCharacter, "characters");

    // match any object with { id: "testId1" }
    expect(characterViewItems).toStrictEqual([viewElement1]);
    expect(characterViewNpcs).toStrictEqual([viewElement2]);
    expect(characterViewCharacters).toStrictEqual([viewElement3]);

    await characterView.clearAllOutOfViewElements(testCharacter._id, testCharacter.x, testCharacter.y);

    const hasItems = await characterView.hasElementOnView(testCharacter, "testId1", "items");
    const hasNpcs = await characterView.hasElementOnView(testCharacter, "testId2", "npcs");
    const hasCharacters = await characterView.hasElementOnView(testCharacter, "testId3", "characters");

    expect(hasItems).toEqual(false);
    expect(hasNpcs).toEqual(false);
    expect(hasCharacters).toEqual(false);
  });
});
