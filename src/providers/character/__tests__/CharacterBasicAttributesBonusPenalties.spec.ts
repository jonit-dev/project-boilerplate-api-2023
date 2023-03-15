import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { BasicAttribute } from "@rpg-engine/shared/dist/types/skills.types";
import { CharacterBasicAttributesBonusPenalties } from "../characterBonusPenalties/CharacterBasicAttributesBonusPenalties";

describe("Case CharacterBasicAttributesBonusPenalties", () => {
  let testCharacter: ICharacter;
  let characterBasicAttributesBonusPenalties: CharacterBasicAttributesBonusPenalties;

  beforeAll(() => {
    characterBasicAttributesBonusPenalties = container.get<CharacterBasicAttributesBonusPenalties>(
      CharacterBasicAttributesBonusPenalties
    );
  });

  beforeEach(async () => {
    testCharacter = await await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasSkills: true,
    });
  });

  it("updateBasicAttributesSkills should return the correct value", async () => {
    const skills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

    const basicAttributes = {
      stamina: 0.1,
      strength: 0.2,
      resistance: 0.2,
      dexterity: -0.1,
      magic: -0.1,
      magicResistance: 0.2,
    };

    await characterBasicAttributesBonusPenalties.updateBasicAttributesSkills(
      skills,
      BasicAttribute.Strength,
      basicAttributes
    );

    expect(skills.strength.skillPoints).toEqual(0.24);
    expect(skills.magic.skillPoints).toEqual(0);

    skills.magic.skillPoints = 10;
    expect(skills.magic.skillPoints).toEqual(10);

    await characterBasicAttributesBonusPenalties.updateBasicAttributesSkills(
      skills,
      BasicAttribute.Magic,
      basicAttributes
    );

    expect(skills.strength.skillPoints).toEqual(expect.closeTo(0.24, 2));
    expect(skills.magic.skillPoints).toEqual(expect.closeTo(10.36, 2));
  });
});
