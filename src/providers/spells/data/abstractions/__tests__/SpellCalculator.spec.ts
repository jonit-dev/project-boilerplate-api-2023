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

    const buff = await spellCalculator.calculateBuffBasedOnSkillLevel(testCharacter, BasicAttribute.Magic, {
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

    const buff = await spellCalculator.calculateBuffBasedOnSkillLevel(testCharacter, BasicAttribute.Magic, {
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

    const timeout = await spellCalculator.calculateTimeoutBasedOnSkillLevel(testCharacter, BasicAttribute.Magic, {
      max: 100,
      min: 15,
      skillAssociation: "reverse",
    });

    expect(timeout).toBeGreaterThanOrEqual(15);
    expect(timeout).toBeLessThanOrEqual(100);
  });
});
