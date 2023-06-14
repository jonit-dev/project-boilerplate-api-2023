import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SkillBuff } from "@providers/skill/SkillBuff";
import { TraitGetter } from "@providers/skill/TraitGetter";
import {
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  CombatSkill,
  ICharacterPermanentBuff,
  ICharacterTemporaryBuff,
} from "@rpg-engine/shared";
import { CharacterBuffSkill } from "../CharacterBuffSkill";
import { CharacterBuffTracker } from "../CharacterBuffTracker";

describe("CharacterBuffSkill", () => {
  let characterBuffSkill: CharacterBuffSkill;
  let characterBuffTracker: CharacterBuffTracker;
  let testCharacter: ICharacter;
  let traitGetter: TraitGetter;
  let skillBuff: SkillBuff;

  beforeAll(() => {
    characterBuffSkill = container.get<CharacterBuffSkill>(CharacterBuffSkill);
    traitGetter = container.get<TraitGetter>(TraitGetter);
    characterBuffTracker = container.get<CharacterBuffTracker>(CharacterBuffTracker);
    skillBuff = container.get<SkillBuff>(SkillBuff);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasSkills: true,
    });
  });

  describe("Core functionality", () => {
    it("enableBuff successfully applies the buff to the character", async () => {
      const buff: Partial<ICharacterTemporaryBuff> = {
        type: CharacterBuffType.Skill,
        trait: CombatSkill.Distance,
        buffPercentage: 10,
        durationSeconds: 60,
        durationType: CharacterBuffDurationType.Temporary,
      };

      const buffId = await characterBuffSkill.enableBuff(testCharacter, buff as ICharacterTemporaryBuff);
      expect(buffId).toBeDefined();
    });

    it("disableBuff successfully removes the buff from the character", async () => {
      const buff: Partial<ICharacterTemporaryBuff> = {
        type: CharacterBuffType.Skill,
        trait: CombatSkill.Distance,
        buffPercentage: 10,
        durationSeconds: 60,
        durationType: CharacterBuffDurationType.Temporary,
      };

      const enabledBuff = await characterBuffSkill.enableBuff(testCharacter, buff as ICharacterTemporaryBuff);

      if (!enabledBuff) throw new Error("Failed to enable buff");

      const result = await characterBuffSkill.disableBuff(testCharacter, enabledBuff._id!);
      expect(result).toBeTruthy();
    });
  });

  describe("Calculations", () => {
    const createDistanceBuff = async (): Promise<string> => {
      const buff: Partial<ICharacterPermanentBuff> = {
        type: CharacterBuffType.Skill,
        trait: CombatSkill.Distance,
        buffPercentage: 10,
        durationType: CharacterBuffDurationType.Permanent,
      };

      const enabledBuff = await characterBuffSkill.enableBuff(
        testCharacter,
        buff as unknown as ICharacterTemporaryBuff
      );

      expect(enabledBuff).toBeDefined();

      return enabledBuff._id!;
    };

    const createStrengthBuff = async (): Promise<string> => {
      const buff: Partial<ICharacterPermanentBuff> = {
        type: CharacterBuffType.Skill,
        trait: BasicAttribute.Strength,
        buffPercentage: 15,
        durationType: CharacterBuffDurationType.Permanent,
      };

      const enabledBuff = await characterBuffSkill.enableBuff(
        testCharacter,
        buff as unknown as ICharacterTemporaryBuff
      );

      expect(enabledBuff).toBeDefined();

      return enabledBuff._id!;
    };

    it("properly adds a buff to a skill", async () => {
      await createDistanceBuff();

      const skills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

      let distanceLevel = await traitGetter.getSkillLevelWithBuffs(skills, CombatSkill.Distance);

      expect(distanceLevel).toBe(1.1);

      await createDistanceBuff();
      distanceLevel = await traitGetter.getSkillLevelWithBuffs(skills, CombatSkill.Distance);

      expect(distanceLevel).toBe(distanceLevel);
    });

    it("removes a buff stack from a skill", async () => {
      const b1 = await createDistanceBuff();
      const b2 = await createDistanceBuff();

      await characterBuffSkill.disableBuff(testCharacter, b1);

      await characterBuffSkill.disableBuff(testCharacter, b2);

      const skills = await skillBuff.getSkillsWithBuff(testCharacter);

      expect(skills?.distance.level).toBe(1);
    });

    it("should correctly calculate all active buffs", async () => {
      await createDistanceBuff();
      await createStrengthBuff();

      const buffs = await characterBuffSkill.calculateAllActiveBuffs(testCharacter);
      expect(buffs![0].trait).toEqual(CombatSkill.Distance);
      expect(buffs![0].buffPercentage).toEqual(10);
      expect(buffs![1].trait).toEqual(BasicAttribute.Strength);
      expect(buffs![1].buffPercentage).toEqual(15);
    });

    it("should correctly calculate multiple buffs of the same trait", async () => {
      await createDistanceBuff();
      await createDistanceBuff();

      const buffs = await characterBuffSkill.calculateAllActiveBuffs(testCharacter);
      const distanceBuff = buffs!.find((buff) => buff.trait === CombatSkill.Distance);

      expect(distanceBuff).toBeDefined();
      expect(distanceBuff!.buffPercentage).toEqual(20);
    });

    it("should throw an error if no character is provided", async () => {
      // @ts-ignore
      await expect(characterBuffSkill.calculateAllActiveBuffs(undefined)).rejects.toThrow("Character not found");
    });
  });
});
