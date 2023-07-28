import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CalculateEffectDamage } from "../CalculateEffectDamage";

describe("CalculateEffectDamage", () => {
  let calculateEffectDamage: CalculateEffectDamage;
  let testAttacker: INPC;
  let testTarget: ICharacter;

  beforeEach(async () => {
    calculateEffectDamage = container.get<CalculateEffectDamage>(CalculateEffectDamage);
    testAttacker = await unitTestHelper.createMockNPC(null, { hasSkills: true });
    testTarget = await unitTestHelper.createMockCharacter(null, { hasSkills: true });

    const testAttackerSkills = (await Skill.findById(testAttacker.skills)) as ISkill;
    testAttackerSkills.level = 50;
    testAttackerSkills.resistance.level = 12;
    testAttackerSkills.magicResistance.level = 14;
    testAttackerSkills.magic.level = 10;

    await testAttackerSkills.save(); // Save the updated skills

    const testTargetSkills = (await Skill.findById(testTarget.skills)) as ISkill;
    testTargetSkills.level = 3;
    testTargetSkills.resistance.level = 2;
    testTargetSkills.magicResistance.level = 4;

    await testTargetSkills.save(); // Save the updated skills
  });
  it("calculateEffectDamage should return correct damage", async () => {
    const spyGetTargetResistance = jest.spyOn(CalculateEffectDamage.prototype as any, "getTargetResistances");
    const spyCalculateTotalEffectDamage = jest.spyOn(
      CalculateEffectDamage.prototype as any,
      "calculateTotalEffectDamage"
    );

    await testAttacker.populate("skills").execPopulate();
    await testTarget.populate("skills").execPopulate();

    const result = await calculateEffectDamage.calculateEffectDamage(testAttacker, testTarget);

    expect(spyGetTargetResistance).toHaveBeenCalledTimes(1);

    expect(spyCalculateTotalEffectDamage).toHaveBeenCalledWith(50, 10, 1, 1, 2, 4, undefined);

    expect(result).toBeLessThanOrEqual(40);
  });
});
