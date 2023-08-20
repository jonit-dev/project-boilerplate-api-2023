import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container, unitTestHelper } from "@providers/inversify/container";
import {
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  CharacterClass,
  CraftingSkill,
} from "@rpg-engine/shared";
import { TraitGetter } from "../TraitGetter";

describe("TraitGetter", () => {
  let traitGetter: TraitGetter;
  let testCharacter: ICharacter;
  let characterBuffActivator: CharacterBuffActivator;

  beforeAll(() => {
    traitGetter = container.get<TraitGetter>(TraitGetter);
    characterBuffActivator = container.get<CharacterBuffActivator>(CharacterBuffActivator);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasSkills: true,
    });

    await testCharacter.populate("skills").execPopulate();
  });

  describe("Class bonus and penalties", () => {
    it("should properly get a skill trait with class bonus and penalties applied", async () => {
      testCharacter.class = CharacterClass.Berserker;
      await testCharacter.save();

      const result = await traitGetter.getSkillLevelWithBuffs(testCharacter.skills as ISkill, BasicAttribute.Strength);

      expect(result).toEqual(1.2);
    });
  });

  describe("Skills getter", () => {
    it("should return a character skill without buff applied", async () => {
      const result = await traitGetter.getSkillLevelWithBuffs(testCharacter.skills as ISkill, CraftingSkill.Fishing);

      expect(result).toEqual(1);
    });

    it("should return a character skill with the buff applied", async () => {
      await characterBuffActivator.enablePermanentBuff(testCharacter, {
        type: CharacterBuffType.Skill,
        trait: CraftingSkill.Fishing,
        buffPercentage: 10,
        durationType: CharacterBuffDurationType.Permanent,
      });

      const result = await traitGetter.getSkillLevelWithBuffs(testCharacter.skills as ISkill, CraftingSkill.Fishing);

      expect(result).toEqual(1.1);
    });
  });

  describe("Character attribute getter", () => {
    it("should return a character attribute without buff applied", async () => {
      const result = await traitGetter.getCharacterAttributeWithBuffs(
        testCharacter,
        CharacterAttributes.AttackIntervalSpeed
      );

      expect(result).toEqual(1700);
    });

    it("should return a character attribute with the buff applied", async () => {
      await characterBuffActivator.enablePermanentBuff(testCharacter, {
        type: CharacterBuffType.CharacterAttribute,
        trait: CharacterAttributes.AttackIntervalSpeed,
        buffPercentage: 10,
        durationType: CharacterBuffDurationType.Permanent,
      });

      const result = await traitGetter.getCharacterAttributeWithBuffs(
        testCharacter,
        CharacterAttributes.AttackIntervalSpeed
      );

      expect(result).toEqual(1870);
    });
  });
});
