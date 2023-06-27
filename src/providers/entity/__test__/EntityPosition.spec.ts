import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { EntityPosition, IEntityPosition } from "../EntityPosition";

describe("EntityPosition", () => {
  let entityPosition: EntityPosition;

  let testCharacter: ICharacter;

  beforeAll(() => {
    entityPosition = container.get(EntityPosition);

    testCharacter = {
      _id: "123",
      name: "character",
      scene: "testScene",
    } as ICharacter;
  });

  it("should properly set an entity position", async () => {
    await entityPosition.setEntityPosition(testCharacter, "characters");
    const foundEntity = await entityPosition.getEntityPosition(testCharacter, "characters");
    expect(foundEntity?._id).toEqual(testCharacter._id);
  });

  it("should properly delete an entity position", async () => {
    await entityPosition.setEntityPosition(testCharacter, "characters");
    await entityPosition.deleteEntityPosition(testCharacter, "characters");
    const foundEntity = await entityPosition.getEntityPosition(testCharacter, "characters");
    expect(foundEntity).toBeUndefined();
  });

  it("should return all entities from view", async () => {
    const character1: ICharacter = { _id: "124", name: "character1", x: 0, y: 0, scene: "testScene" } as ICharacter;
    const character2: ICharacter = {
      _id: "125",
      name: "character2",
      x: 900,
      y: 900,
      scene: "testScene",
    } as ICharacter;

    await entityPosition.setEntityPosition(character1, "characters");
    await entityPosition.setEntityPosition(character2, "characters");

    const results = await entityPosition.getAllEntitiesFromScene("testScene", "characters");

    expect(results).toBeTruthy();
    expect(results.length).toEqual(2);
  });

  describe("getEntitiesInView", () => {
    it("should return entities within the view area", async () => {
      const character1: ICharacter = { _id: "124", name: "character1", x: 0, y: 0, scene: "testScene" } as ICharacter;
      const character2: ICharacter = {
        _id: "125",
        name: "character2",
        x: 900,
        y: 900,
        scene: "testScene",
      } as ICharacter;

      await entityPosition.setEntityPosition(character1, "characters");
      await entityPosition.setEntityPosition(character2, "characters");

      const foundEntities = await entityPosition.getEntitiesInView(0, 0, "testScene", "characters");

      expect(foundEntities.find((char: IEntityPosition) => char._id === character1._id)).toBeTruthy();
      expect(foundEntities).not.toContain(character2);
    });
  });

  describe("Edge cases", () => {
    let testCharacter: ICharacter;

    beforeEach(async () => {
      testCharacter = await unitTestHelper.createMockCharacter({
        x: 0,
        y: 0,
      });
    });

    it("should set a character on the view", async () => {
      await entityPosition.setEntityPosition(testCharacter, "characters");

      const result = await entityPosition.getEntitiesInView(0, 0, "example", "characters");

      const foundChar = result.find((char: IEntityPosition) => char._id === testCharacter._id.toString());

      expect(foundChar).toBeTruthy();
    });

    it("should update a character on the view", async () => {
      testCharacter.x = FromGridX(1);
      testCharacter.y = FromGridY(1);
      await testCharacter.save();

      await entityPosition.setEntityPosition(testCharacter, "characters");

      const result = await entityPosition.getEntitiesInView(0, 0, "example", "characters");

      const foundChar = result.find((char: IEntityPosition) => char._id === testCharacter._id.toString());

      expect(foundChar).toBeTruthy();
      expect(foundChar?.x).toBe(FromGridX(1));
      expect(foundChar?.y).toBe(FromGridY(1));
    });
  });

  describe("updateEntityPosition", () => {
    let oldCharacter: ICharacter;

    beforeEach(async () => {
      oldCharacter = {
        _id: "123",
        name: "character",
        x: 0,
        y: 0,
        scene: "testScene",
      } as ICharacter;

      await entityPosition.setEntityPosition(oldCharacter, "characters");
    });

    it("should properly update an entity position", async () => {
      await entityPosition.updateEntityPosition(oldCharacter, "characters", {
        x: 10,
        y: 10,
      });

      const foundEntity = await entityPosition.getEntityPosition(oldCharacter, "characters");

      expect(foundEntity).toBeTruthy();

      expect(foundEntity?._id).toBe(oldCharacter._id);

      expect(foundEntity?.x).toBe(10);
      expect(foundEntity?.y).toBe(10);
    });
  });
});
