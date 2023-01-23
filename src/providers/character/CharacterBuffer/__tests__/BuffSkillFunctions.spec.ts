import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { BasicAttribute } from "@rpg-engine/shared";
import { Types } from "mongoose";
import { BuffSkillFunctions } from "../BuffSkillFunctions";
import { CharacterBasicAttributesBuff } from "../CharacterBasicAttributesBuff";

describe("buffSkillFunctions", () => {
  let testCharacter: ICharacter;
  let characterBasicAttributesBuff: CharacterBasicAttributesBuff;
  let buffSkillFunctions: BuffSkillFunctions;
  let findByIdMock: jest.Mock;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    buffSkillFunctions = container.get<BuffSkillFunctions>(BuffSkillFunctions);
    characterBasicAttributesBuff = container.get(CharacterBasicAttributesBuff);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await (
      await unitTestHelper.createMockCharacter(null, {
        hasEquipment: true,
        hasSkills: true,
      })
    )
      .populate("skills")
      .execPopulate();
    findByIdMock = jest.fn();
  });

  it("calculate decrease updateBasicAttribute", async () => {
    const skill = {
      strength: {
        level: 30,
        skillPoints: 50,
        skillPointsToNextLevel: 20,
      },
    } as ISkill;

    findByIdMock.mockReturnValue(Promise.resolve(skill));
    const skillType = "strength";
    const porcentage = -10;

    await characterBasicAttributesBuff.updateBasicAttribute(testCharacter, BasicAttribute.Strength, porcentage * -1);

    const skill1 = {
      strength: {
        level: 33,
        skillPoints: 50,
        skillPointsToNextLevel: 20,
      },
    } as ISkill;

    findByIdMock.mockReturnValue(Promise.resolve(skill1));
    expect(skill1[skillType].level).toEqual(33);

    await characterBasicAttributesBuff.updateBasicAttribute(testCharacter, BasicAttribute.Strength, porcentage);
    const skill3 = {
      strength: {
        level: 30,
        skillPoints: 50,
        skillPointsToNextLevel: 20,
      },
    } as ISkill;

    findByIdMock.mockReturnValue(Promise.resolve(skill3));
    expect(skill3[skillType].level).toEqual(30);
  });

  it("should return correct total value for key", () => {
    const array = [
      { key: "strength", value: 2 },
      { key: "dexterity", value: 3 },
      { key: "magic", value: 1 },
    ];
    const key = "strength";
    const totalValue = buffSkillFunctions.getTotalValueByKey(array, key);
    expect(totalValue).toEqual(2);
  });

  it("should return 0 when key is not found", () => {
    const array = [
      { key: "strength", value: 2 },
      { key: "dexterity", value: 3 },
      { key: "magic", value: 1 },
    ];
    const key = "intelligence";
    const totalValue = buffSkillFunctions.getTotalValueByKey(array, key);
    expect(totalValue).toEqual(0);
  });

  it("should return correct value for buff id", () => {
    const array = [
      { _id: new Types.ObjectId(), key: "strength", value: 2 },
      { _id: new Types.ObjectId(), key: "dexterity", value: 3 },
      { _id: new Types.ObjectId(), key: "magic", value: 1 },
    ];
    const buffId = array[0]._id;
    const value = buffSkillFunctions.getValueByBuffId(array, buffId);
    expect(value).toEqual(2);
  });

  it("should return 0 when buff id is not found", () => {
    const array = [
      { _id: new Types.ObjectId(), key: "strength", value: 2 },
      { _id: new Types.ObjectId(), key: "dexterity", value: 3 },
      { _id: new Types.ObjectId(), key: "magic", value: 1 },
    ];
    const buffId = new Types.ObjectId();
    const value = buffSkillFunctions.getValueByBuffId(array, buffId);
    expect(value).toEqual(0);
  });

  it("should return correct increase level for positive percentage", () => {
    const currentLvl = 30;
    const percentage = 10;
    const increaseLvl = buffSkillFunctions.calculateIncreaseLvl(currentLvl, percentage);
    expect(increaseLvl).toEqual(3);
  });

  it("should return 0 for negative percentage", () => {
    const currentLvl = 30;
    const percentage = -10;
    const increaseLvl = buffSkillFunctions.calculateIncreaseLvl(currentLvl, percentage);
    expect(increaseLvl).toEqual(0);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
