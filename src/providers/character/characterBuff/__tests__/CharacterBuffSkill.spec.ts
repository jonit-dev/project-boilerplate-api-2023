import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import {
  CharacterBuffDurationType,
  CharacterBuffType,
  CombatSkill,
  ICharacterPermanentBuff,
  ICharacterTemporaryBuff,
} from "@rpg-engine/shared";
import { CharacterBuffSkill } from "../CharacterBuffSkill";

describe("CharacterBuffSkill", () => {
  let characterBuffSkill: CharacterBuffSkill;
  let testCharacter: ICharacter;

  beforeAll(() => {
    characterBuffSkill = container.get<CharacterBuffSkill>(CharacterBuffSkill);
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
    const createNewBuff = async (): Promise<string> => {
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
    it("properly adds a buff to a skill", async () => {
      await createNewBuff();

      const skills = await Skill.findById(testCharacter.skills);

      expect(skills?.distance.level).toBe(1.1);

      await createNewBuff();

      const skills2 = await Skill.findById(testCharacter.skills);

      expect(skills2?.distance.level).toBe(1.2);
    });

    it("removes a buff stack from a skill", async () => {
      const b1 = await createNewBuff();
      const b2 = await createNewBuff();

      await characterBuffSkill.disableBuff(testCharacter, b1);

      await characterBuffSkill.disableBuff(testCharacter, b2);

      const skills = await Skill.findById(testCharacter.skills);

      expect(skills?.distance.level).toBe(1);
    });
  });
});
