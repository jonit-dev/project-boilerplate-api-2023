import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { BasicAttribute } from "@rpg-engine/shared";
import { SpellCalculator } from "../SpellCalculator";

describe("SpellCalculator", () => {
  let spellCalculator: SpellCalculator;
  let testCharacter: ICharacter;

  beforeAll(() => {
    spellCalculator = container.get(SpellCalculator);
  });
  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasSkills: true });
  });

  it("calculates a quantity based on skill level", async () => {
    const skills = (await Skill.findOne({ _id: testCharacter.skills }).lean()) as ISkill;
    skills.magic.level = 20;
    await Skill.updateOne({ _id: testCharacter.skills }, skills);

    const qty = await spellCalculator.getQuantityBasedOnSkillLevel(testCharacter, BasicAttribute.Magic, {
      max: 100,
      min: 1,
      difficulty: 4,
    });

    expect(qty).toBeGreaterThanOrEqual(1);
    expect(qty).toBeLessThanOrEqual(5);
  });

  it("calculates buff based on skill level within a predefined range", async () => {
    const skills = (await Skill.findOne({ _id: testCharacter.skills }).lean()) as ISkill;
    skills.magic.level = 50;
    await Skill.updateOne({ _id: testCharacter.skills }, skills);

    const buff = await spellCalculator.calculateBasedOnSkillLevel(testCharacter, BasicAttribute.Magic, {
      max: 20,
      min: 10,
    });

    expect(buff).toBeGreaterThanOrEqual(10);
    expect(buff).toBeLessThanOrEqual(20);
  });

  it("calculates buff with reverse skill association based on skill level", async () => {
    const skills = (await Skill.findOne({ _id: testCharacter.skills }).lean()) as ISkill;
    skills.magic.level = 50;
    await Skill.updateOne({ _id: testCharacter.skills }, skills);

    const buff = await spellCalculator.calculateBasedOnSkillLevel(testCharacter, BasicAttribute.Magic, {
      max: 20,
      min: 10,
      skillAssociation: "reverse",
    });

    expect(buff).toBeGreaterThanOrEqual(10);
    expect(buff).toBeLessThanOrEqual(20);
  });

  it("calculates timeout with reverse skill association based on skill level", async () => {
    const skills = (await Skill.findOne({ _id: testCharacter.skills }).lean()) as ISkill;
    skills.magic.level = 10;
    await Skill.updateOne({ _id: testCharacter.skills }, skills);

    const timeout = await spellCalculator.calculateBasedOnSkillLevel(testCharacter, BasicAttribute.Magic, {
      max: 100,
      min: 15,
      skillAssociation: "reverse",
    });

    expect(timeout).toBeGreaterThanOrEqual(15);
    expect(timeout).toBeLessThanOrEqual(100);
  });

  it("calculates a spell damage based on skill level", async () => {
    const skills = (await Skill.findOne({ _id: testCharacter.skills }).lean()) as ISkill;
    skills.magic.level = 50; // Setting magic skill level to 50 for the test
    await Skill.updateOne({ _id: testCharacter.skills }, skills);

    const minMultiplier = 0.5; // Your test min multiplier
    const maxMultiplier = 1.5; // Your test max multiplier

    const expectedMinDamage = 50 * minMultiplier; // 25
    const expectedMaxDamage = 50 * maxMultiplier; // 75

    // When level is not considered
    const damageWithoutLevel = await spellCalculator.spellDamageCalculator(testCharacter, BasicAttribute.Magic, {
      minSkillMultiplier: minMultiplier,
      maxSkillMultiplier: maxMultiplier,
      bonusDamage: true,
    });

    expect(damageWithoutLevel).toBeGreaterThanOrEqual(expectedMinDamage);
    expect(damageWithoutLevel).toBeLessThanOrEqual(expectedMaxDamage);

    // When level is considered, assuming getCharacterLevel would return 10 for testCharacter
    const damageWithLevel = await spellCalculator.spellDamageCalculator(testCharacter, BasicAttribute.Magic, {
      minSkillMultiplier: minMultiplier,
      maxSkillMultiplier: maxMultiplier,
      level: true,
      minLevelMultiplier: 0.1,
      maxLevelMultiplier: 0.9,
      bonusDamage: true,
    });

    const expectedMinDamageWithLevel = expectedMinDamage + 10 * 0.1; // 26
    const expectedMaxDamageWithLevel = expectedMaxDamage + 10 * 0.9; // 84

    expect(damageWithLevel).toBeGreaterThanOrEqual(expectedMinDamageWithLevel);
    expect(damageWithLevel).toBeLessThanOrEqual(expectedMaxDamageWithLevel);
  });
});
