import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container, unitTestHelper } from "@providers/inversify/container";
import { NPCExperience } from "@providers/npc/NPCExperience/NPCExperience";
import { CharacterAttributes, CharacterBuffDurationType, CharacterBuffType } from "@rpg-engine/shared";
import { v4 as uuidv4 } from "uuid";
import { SkillStatsIncrease } from "../SkillStatsIncrease";

describe("SkillStatsIncrease", () => {
  let skillStatsIncrease: SkillStatsIncrease;

  beforeAll(() => {
    skillStatsIncrease = container.get(SkillStatsIncrease);
  });

  describe("maxHealth and maxMana gains", () => {
    let testNPC: INPC;
    let increaseMaxHealthMaxManaSpy: jest.SpyInstance;
    let sendEventToUserSpy: jest.SpyInstance;
    let characterBuffActivator: CharacterBuffActivator;
    let npcExperience: NPCExperience;

    let testCharacter: ICharacter;

    beforeAll(() => {
      characterBuffActivator = container.get(CharacterBuffActivator);
      npcExperience = container.get(NPCExperience);
    });

    beforeEach(async () => {
      testCharacter = await unitTestHelper.createMockCharacter(null, { hasSkills: true });

      jest.useFakeTimers({ advanceTimers: true });
      testNPC = await unitTestHelper.createMockNPC({
        xpToRelease: [{ xpId: uuidv4(), charId: testCharacter._id, xp: 100 }],
      });

      increaseMaxHealthMaxManaSpy = jest.spyOn(
        // @ts-ignore
        npcExperience.skillLvUpStatsIncrease,
        "increaseMaxManaMaxHealth"
      );
      // @ts-ignore
      sendEventToUserSpy = jest.spyOn(npcExperience.socketMessaging, "sendEventToUser");

      const skills = (await Skill.findById(testCharacter.skills)) as ISkill;
      skills.level = 1;
      skills.experience = 0;

      await skills.save();
    });

    afterEach(() => {
      jest.useRealTimers();
      jest.clearAllMocks();
    });

    it("should properly gain maxHealth and maxMana on level up", async () => {
      testNPC.health = 0;
      await testNPC.save();

      await npcExperience.releaseXP(testNPC);

      expect(increaseMaxHealthMaxManaSpy).toHaveBeenCalledWith(testCharacter._id);
    });

    it("buffs x maxHealth and maxMana gains", async () => {
      const buff = await characterBuffActivator.enablePermanentBuff(testCharacter, {
        type: CharacterBuffType.CharacterAttribute,
        trait: CharacterAttributes.MaxHealth,
        buffPercentage: 10,
        durationType: CharacterBuffDurationType.Permanent,
      });

      if (!buff) {
        throw new Error("Buff not found");
      }
      testNPC.health = 0;
      await testNPC.save();

      await npcExperience.releaseXP(testNPC);

      expect(increaseMaxHealthMaxManaSpy).toHaveBeenCalledWith(testCharacter._id);

      testCharacter = (await Character.findById(testCharacter._id).lean()) as ICharacter;

      let newMaxHealth = testCharacter.maxHealth;
      let newMaxMana = testCharacter.maxMana;

      expect(newMaxHealth).toBe(134);
      expect(newMaxMana).toBe(122);

      await characterBuffActivator.disableBuff(testCharacter, buff._id!, buff.type);

      testCharacter = (await Character.findById(testCharacter._id).lean()) as ICharacter;

      newMaxHealth = testCharacter.maxHealth;
      newMaxMana = testCharacter.maxMana;

      expect(newMaxHealth).toBe(124);
      expect(newMaxMana).toBe(122);
    });
  });
});
