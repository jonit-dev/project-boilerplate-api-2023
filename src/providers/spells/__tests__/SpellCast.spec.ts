import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { SP_INCREASE_RATIO, SP_MAGIC_INCREASE_TIMES_MANA } from "@providers/constants/SkillConstants";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { AnimationSocketEvents, CharacterSocketEvents, SkillSocketEvents, UISocketEvents } from "@rpg-engine/shared";
import { spellSelfHealing } from "../data/blueprints/SpellSelfHealing";
import { SpellCast } from "../SpellCast";

describe("SpellCast.ts", () => {
  let spellCast: SpellCast;
  let testCharacter: ICharacter;
  let characterSkills: ISkill;
  let sendEventToUser: jest.SpyInstance;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    spellCast = container.get<SpellCast>(SpellCast);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await (
      await unitTestHelper.createMockCharacter(
        { health: 50, learnedSpells: [spellSelfHealing.key] },
        { hasEquipment: false, hasInventory: false, hasSkills: true }
      )
    )
      .populate("skills")
      .execPopulate();

    characterSkills = testCharacter.skills as unknown as ISkill;
    characterSkills.level = spellSelfHealing.minLevelRequired!;
    characterSkills.magic.level = spellSelfHealing.minMagicLevelRequired;
    await characterSkills.save();

    sendEventToUser = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");
  });

  afterEach(() => {
    sendEventToUser.mockRestore();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });

  describe("verify message is a spell being cast", () => {
    it("should be self healing spell casting", async () => {
      expect(await spellCast.isSpellCasting("talas faenya")).toBeTruthy();
    });

    it("should not be self healing spell casting", async () => {
      expect(await spellCast.isSpellCasting("talas faenya ")).toBeFalsy();
    });
  });

  it("should fail with spell not found", async () => {
    expect(await spellCast.castSpell("talas faenya ", testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, spell not found.",
      type: "error",
    });
  });

  it("should call character validation", async () => {
    const characterValidationMock = jest.spyOn(CharacterValidation.prototype, "hasBasicValidation");
    characterValidationMock.mockReturnValue(false);

    expect(await spellCast.castSpell("talas faenya", testCharacter)).toBeFalsy();
    expect(characterValidationMock).toHaveBeenLastCalledWith(testCharacter);

    characterValidationMock.mockRestore();
  });

  it("should fail with spell not learned", async () => {
    const runTest = async (): Promise<void> => {
      sendEventToUser.mockReset();

      expect(await spellCast.castSpell("talas faenya", testCharacter)).toBeFalsy();

      expect(sendEventToUser).toBeCalledTimes(1);

      expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
        message: "Sorry, you have not learned this spell.",
        type: "error",
      });
    };

    testCharacter.learnedSpells = undefined;
    await testCharacter.save();
    await runTest();

    testCharacter.learnedSpells = [];
    await testCharacter.save();
    await runTest();
  });

  it("should fail with not enough mana", async () => {
    testCharacter.mana = (spellSelfHealing.manaCost ?? 1) - 1;
    await testCharacter.save();

    expect(await spellCast.castSpell("talas faenya", testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you do not have mana to cast this spell.",
      type: "error",
    });
  });

  it("should fail due to lower character level", async () => {
    characterSkills.level = (spellSelfHealing.minLevelRequired ?? 2) - 1;
    await characterSkills.save();

    expect(await spellCast.castSpell("talas faenya", testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you can not cast this spell at this character level.",
      type: "error",
    });
  });

  it("should fail due to lower magic level", async () => {
    characterSkills.magic.level = (spellSelfHealing.minMagicLevelRequired ?? 2) - 1;
    await characterSkills.save();

    expect(await spellCast.castSpell("talas faenya", testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you can not cast this spell at this character magic level.",
      type: "error",
    });
  });

  it("should cast self healing spell successfully", async () => {
    const newHealth = testCharacter.health + spellSelfHealing.manaCost!;
    const newMana = testCharacter.mana - spellSelfHealing.manaCost!;

    expect(await spellCast.castSpell("talas faenya", testCharacter)).toBeTruthy();

    const character = (await Character.findById(testCharacter.id)) as unknown as ICharacter;
    expect(character.health).toBe(newHealth);
    expect(character.mana).toBe(newMana);

    /**
     * 1. health changed event
     * 2. life heal animation event
     * 3. skill update event
     */
    expect(sendEventToUser).toBeCalledTimes(3);

    expect(sendEventToUser).toHaveBeenNthCalledWith(
      1,
      testCharacter.channelId,
      CharacterSocketEvents.AttributeChanged,
      {
        targetId: testCharacter._id,
        health: newHealth,
        mana: newMana,
      }
    );

    expect(sendEventToUser).toHaveBeenNthCalledWith(2, testCharacter.channelId, AnimationSocketEvents.ShowAnimation, {
      targetId: testCharacter._id,
      effectKey: spellSelfHealing.animationKey,
    });
  });

  it("should call skill increase functionality to increase character skills", async () => {
    const increaseSPMock = jest.spyOn(SkillIncrease.prototype, "increaseMagicSP");
    increaseSPMock.mockImplementation();

    expect(await spellCast.castSpell("talas faenya", testCharacter)).toBeTruthy();

    expect(increaseSPMock).toHaveBeenCalledTimes(1);
    expect(increaseSPMock).toHaveBeenLastCalledWith(testCharacter, spellSelfHealing);

    increaseSPMock.mockRestore();
  });

  it("should increase skill and send skill update event", async () => {
    expect(await spellCast.castSpell("talas faenya", testCharacter)).toBeTruthy();

    const updatedSkills: ISkill = (await Skill.findById(testCharacter.skills)) as unknown as ISkill;
    const skillPoints = SP_INCREASE_RATIO + SP_MAGIC_INCREASE_TIMES_MANA * (spellSelfHealing.manaCost ?? 0);
    expect(updatedSkills?.magic.skillPoints).toBe(skillPoints);

    expect(sendEventToUser).toBeCalledTimes(3);

    const skillUpdateEventParams = sendEventToUser.mock.calls[2];

    expect(skillUpdateEventParams[0]).toBe(testCharacter.channelId);
    expect(skillUpdateEventParams[1]).toBe(SkillSocketEvents.ReadInfo);

    expect(skillUpdateEventParams[2]).toBeDefined();
    expect(skillUpdateEventParams[2].skill).toBeDefined();
    expect(skillUpdateEventParams[2].skill.magic).toBeDefined();
    expect(skillUpdateEventParams[2].skill.magic.skillPoints).toBe(skillPoints);
  });

  it("should not cast spell if character does not have any skills", async () => {
    testCharacter.skills = undefined;
    await testCharacter.save();

    expect(await spellCast.castSpell("talas faenya", testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you can not cast this spell without any skills.",
      type: "error",
    });
  });

  it("should add spells to learned spells (level 2 character)", async () => {
    const runTest = async (): Promise<void> => {
      await spellCast.learnLatestSkillLevelSpells(testCharacter._id, false);

      const character = (await Character.findOne({ _id: testCharacter._id }).populate(
        "skills"
      )) as unknown as ICharacter;
      const skills = character.skills as unknown as ISkill;

      expect(skills.level).toBe(2);
      expect(character.learnedSpells).toBeDefined();
      expect([...character.learnedSpells!]).toEqual([spellSelfHealing.key]);

      expect(sendEventToUser).not.toHaveBeenCalled();
    };

    testCharacter.learnedSpells = undefined;
    await testCharacter.save();
    await runTest();
  });

  it("should add spells to learned spells (level 2 character) and notify user", async () => {
    const runTest = async (): Promise<void> => {
      await spellCast.learnLatestSkillLevelSpells(testCharacter._id, true);

      const character = (await Character.findOne({ _id: testCharacter._id }).populate(
        "skills"
      )) as unknown as ICharacter;
      const skills = character.skills as unknown as ISkill;

      expect(skills.level).toBe(2);
      expect(character.learnedSpells).toBeDefined();
      expect([...character.learnedSpells!]).toEqual([spellSelfHealing.key]);

      expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
        message: "You have learned new spell(s): Self Healing Spell (talas faenya)",
        type: "info",
      });
    };

    testCharacter.learnedSpells = undefined;
    await testCharacter.save();
    await runTest();
  });

  it("should not duplicate spells on append (level 2 character)", async () => {
    const runTest = async (): Promise<void> => {
      await spellCast.learnLatestSkillLevelSpells(testCharacter._id, false);

      const character = (await Character.findOne({ _id: testCharacter._id }).populate(
        "skills"
      )) as unknown as ICharacter;
      const skills = character.skills as unknown as ISkill;

      expect(skills.level).toBe(2);
      expect(character.learnedSpells).toBeDefined();
      expect([...character.learnedSpells!]).toEqual([spellSelfHealing.key]);
    };

    testCharacter.learnedSpells = [spellSelfHealing.key!];
    await testCharacter.save();
    await runTest();
  });

  it("should not add any spell to character (level 1 character)", async () => {
    const runTest = async (): Promise<void> => {
      await spellCast.learnLatestSkillLevelSpells(testCharacter._id, true);

      const character = (await Character.findOne({ _id: testCharacter._id }).populate(
        "skills"
      )) as unknown as ICharacter;
      const skills = character.skills as unknown as ISkill;

      expect(skills.level).toBe(1);
      expect(character.learnedSpells).toBeDefined();
      expect([...character.learnedSpells!]).toEqual([]);

      expect(sendEventToUser).not.toHaveBeenCalled();
    };

    testCharacter.learnedSpells = undefined;
    await testCharacter.save();

    characterSkills.level = 1;
    await characterSkills.save();

    await runTest();
  });
});
