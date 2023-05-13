import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SpellItemQuantityCalculator } from "../SpellItemQuantityCalculator";

describe("SpellItemQuantityCalculator", () => {
  let spellItemQuantityCalculator: SpellItemQuantityCalculator;
  let testCharacter: ICharacter;

  beforeAll(() => {
    spellItemQuantityCalculator = container.get(SpellItemQuantityCalculator);
  });
  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasSkills: true });
  });

  it("calculates a quantity based on skill level", async () => {
    const skills = (await Skill.findOne({ _id: testCharacter.skills }).lean()) as ISkill;
    skills.magic.level = 20;
    await Skill.updateOne({ _id: testCharacter.skills }, skills);

    const qty = await spellItemQuantityCalculator.getQuantityBasedOnSkillLevel(testCharacter, "magic", {
      max: 100,
      min: 1,
      difficulty: 4,
    });

    expect(qty).toBeGreaterThanOrEqual(1);
    expect(qty).toBeLessThanOrEqual(5);
  });
});
