import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { EntityPosition } from "@providers/entity/EntityPosition";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterRepository } from "../CharacterRepository";

describe("CharacterRepository", () => {
  let testCharacter: ICharacter;
  let characterRepository: CharacterRepository;
  let entityPosition: EntityPosition;

  beforeAll(() => {
    characterRepository = container.get(CharacterRepository);
    entityPosition = container.get(EntityPosition);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("should properly find one character", async () => {
    const foundCharacter = await characterRepository.findOne({ _id: testCharacter.id });
    expect(foundCharacter).toBeTruthy();
    expect(foundCharacter?.id).toBe(testCharacter.id);
  });

  it("should properly find character by id", async () => {
    const foundCharacter = await characterRepository.findById(testCharacter.id);
    expect(foundCharacter).toBeTruthy();
    expect(foundCharacter?.id).toBe(testCharacter.id);
  });

  it("should properly find and update a character", async () => {
    const updatedName = "Updated Name";
    const updatedCharacter = await characterRepository.findByIdAndUpdate(testCharacter.id, { name: updatedName });
    expect(updatedCharacter).toBeTruthy();
    expect(updatedCharacter?.id).toBe(testCharacter.id);
    expect(updatedCharacter?.name).toBe(updatedName);
  });

  it("should properly find all characters", async () => {
    await unitTestHelper.createMockCharacter();

    const foundCharacters = await characterRepository.find({});

    expect(foundCharacters).toBeTruthy();

    expect(foundCharacters.length).toEqual(2);
  });

  describe("Middleware functionality", () => {
    it("should properly return a in-memory redis stored position", async () => {
      await entityPosition.setEntityPosition(testCharacter, "characters");

      await entityPosition.updateEntityPosition(testCharacter, "characters", {
        x: 999,
        y: 999,
      });

      const char = await characterRepository.findById(testCharacter.id, {
        activateMiddleware: true,
      });

      expect(char).toBeTruthy();
      expect(char?.x).toBe(999);
      expect(char?.y).toBe(999);
    });

    it("should properly return an in-memory redis stored position for a collection of characters", async () => {
      await entityPosition.setEntityPosition(testCharacter, "characters");

      await entityPosition.updateEntityPosition(testCharacter, "characters", {
        x: 999,
        y: 999,
      });

      const char2 = await unitTestHelper.createMockCharacter();

      await entityPosition.setEntityPosition(char2, "characters");

      await entityPosition.updateEntityPosition(char2, "characters", {
        x: 999,
        y: 999,
      });

      const results = await characterRepository.find(
        {},
        {
          activateMiddleware: true,
        }
      );

      expect(results).toBeTruthy();

      expect(results.length).toEqual(2);

      expect(results[0].x).toBe(999);
      expect(results[0].y).toBe(999);
      expect(results[1].x).toBe(999);
      expect(results[1].y).toBe(999);
    });
  });

  describe("Select and populate", () => {
    it("Should perform a select fields properly", async () => {
      const result = await characterRepository.findById(testCharacter.id, {
        leanType: "lean",
        select: "name health maxHealth",
      });

      expect(result).toBeTruthy();

      expect(result?.name).toBeTruthy();

      expect(result?.health).toBeTruthy();

      expect(result?.maxHealth).toBeTruthy();

      expect(result?.x).toBeFalsy();
    });

    it("should perform a populate properly", async () => {
      const characterWithSkills = await unitTestHelper.createMockCharacter(null, {
        hasSkills: true,
      });

      const result = await characterRepository.findOne(
        {
          _id: characterWithSkills.id,
        },
        {
          populate: "skills",
        }
      );

      expect(result).toBeTruthy();

      const skills = result?.skills as ISkill;

      expect(skills.level).toBeTruthy();
    });
  });
});
