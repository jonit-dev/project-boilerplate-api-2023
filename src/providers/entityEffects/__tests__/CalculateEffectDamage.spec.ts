import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { ENTITY_EFFECT_DAMAGE_LEVEL_MULTIPLIER } from "@providers/constants/EntityEffectsConstants";
import { container, unitTestHelper } from "@providers/inversify/container";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { BasicAttribute } from "@rpg-engine/shared";
import { CalculateEffectDamage } from "../CalculateEffectDamage";

describe("CalculateEffectDamage", () => {
  let calculateEffectDamage: CalculateEffectDamage;
  let testAttacker: INPC;
  let testTarget: ICharacter;

  beforeEach(async () => {
    calculateEffectDamage = container.get<CalculateEffectDamage>(CalculateEffectDamage);
    testAttacker = await unitTestHelper.createMockNPC(null, { hasSkills: true });
    testTarget = await unitTestHelper.createMockCharacter(null, { hasSkills: true });

    // attackerLevel = 3
    Skill.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ level: 3 }),
    });

    // resistanceLevel and  magicResistanceLevel 2
    const mockTraitGetter = {
      getSkillLevelWithBuffs: jest.fn().mockImplementation((skill, attribute) => {
        return attribute === BasicAttribute.Resistance || attribute === BasicAttribute.MagicResistance
          ? Promise.resolve(2)
          : Promise.reject(new Error("Unknown attribute"));
      }),
    };

    container.unbind(TraitGetter);
    // @ts-ignore
    container.bind(TraitGetter).toConstantValue(mockTraitGetter);
  });

  test("calculateEffectDamage should return correct damage", async () => {
    const result = await calculateEffectDamage.calculateEffectDamage(testAttacker, testTarget);

    expect(Skill.findOne).toHaveBeenCalledWith({ _id: testTarget.skills });

    expect(container.get(TraitGetter).getSkillLevelWithBuffs).toHaveBeenNthCalledWith(
      1,
      { level: 3 },
      BasicAttribute.Resistance
    );

    expect(container.get(TraitGetter).getSkillLevelWithBuffs).toHaveBeenNthCalledWith(
      2,
      { level: 3 },
      BasicAttribute.MagicResistance
    );

    const maxDamage = Math.ceil(3 * ENTITY_EFFECT_DAMAGE_LEVEL_MULTIPLIER);
    const maxDefense = 2 + 2; // resistanceLevel + magicResistanceLevel

    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(Math.max(maxDamage - maxDefense, 1));
  });
});
