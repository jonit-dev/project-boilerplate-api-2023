import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterBasicAttributesBonusPenalties } from "../characterBonusPenalties/CharacterBasicAttributesBonusPenalties";

describe("Case CharacterBasicAttributesBonusPenalties", () => {
  let testCharacter: ICharacter;
  let characterBasicAttributesBonusPenalties: CharacterBasicAttributesBonusPenalties;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    characterBasicAttributesBonusPenalties = container.get<CharacterBasicAttributesBonusPenalties>(
      CharacterBasicAttributesBonusPenalties
    );
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
  });

  it("updateBasicAttributesSkills should return the correct value", async () => {
    const skills = (await Skill.findById(testCharacter.skills)) as ISkill;

    let skillType = "strength";
    const basicAttributes = {
      strength: 0.2,
      resistance: 0.2,
      dexterity: -0.1,
      magic: -0.1,
      magicResistance: 0.2,
    };

    await characterBasicAttributesBonusPenalties.updateBasicAttributesSkills(skills, skillType, basicAttributes);

    expect(skills!.strength.skillPoints).toEqual(0.24);
    expect(skills!.magic.skillPoints).toEqual(0);

    skillType = "magic";
    skills!.magic.skillPoints = 10;
    expect(skills!.magic.skillPoints).toEqual(10);

    await characterBasicAttributesBonusPenalties.updateBasicAttributesSkills(skills, skillType, basicAttributes);

    expect(skills!.strength.skillPoints).toEqual(expect.closeTo(0.24, 2));
    expect(skills!.magic.skillPoints).toEqual(expect.closeTo(10.36, 2));
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
