import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import {
  ML_INCREASE_RATIO,
  SP_INCREASE_RATIO,
  SP_MAGIC_INCREASE_TIMES_MANA,
} from "@providers/constants/SkillConstants";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { TimerWrapper } from "@providers/helpers/TimerWrapper";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { Execution } from "@providers/spells/data/logic/berserker/Execution";
import {
  AnimationSocketEvents,
  CharacterClass,
  CharacterSocketEvents,
  EntityType,
  GRID_WIDTH,
  ISpell,
  Modes,
  NPCAlignment,
  NPCMovementType,
  SkillSocketEvents,
  SpellSocketEvents,
  SpellsBlueprint,
  UISocketEvents,
} from "@rpg-engine/shared";
import { SpellCast } from "../SpellCast";
import { SpellLearn } from "../SpellLearn";
import { spellArrowCreation } from "../data/blueprints/all/SpellArrowCreation";
import { spellBlankRuneCreation } from "../data/blueprints/all/SpellBlankRuneCreation";
import { spellGreaterHealing } from "../data/blueprints/all/SpellGreaterHealing";
import { spellSelfHealing } from "../data/blueprints/all/SpellSelfHealing";
import { spellTeleport } from "../data/blueprints/all/SpellTeleport";
import { rogueSpellExecution } from "../data/blueprints/rogue/SpellExecution";
import { spellStealth } from "../data/blueprints/rogue/SpellStealth";
import { spellStunTarget } from "../data/blueprints/warrior/SpellStunTarget";
import SpellSilence from "../data/logic/mage/druid/SpellSilence";

describe("SpellCast.ts", () => {
  let spellCast: SpellCast;
  let spellLearn: SpellLearn;
  let testCharacter: ICharacter;
  let targetCharacter: ICharacter;
  let characterSkills: ISkill;
  let sendEventToUser: jest.SpyInstance;
  let level2Spells: Partial<ISpell>[] = [];
  let specialEffect: SpecialEffect;
  let berserkerSpells: Execution;

  // let level3Spells: Partial<ISpell>[] = [];
  // let level4Spells: Partial<ISpell>[] = [];
  // let level5Spells: Partial<ISpell>[] = [];

  beforeAll(() => {
    spellCast = container.get<SpellCast>(SpellCast);
    spellLearn = container.get<SpellLearn>(SpellLearn);
    specialEffect = container.get<SpecialEffect>(SpecialEffect);
    berserkerSpells = container.get(Execution);

    level2Spells = [spellSelfHealing, spellArrowCreation, spellBlankRuneCreation, spellTeleport];
    // level3Spells = [spellBoltCreation, spellFoodCreation];
    // level4Spells = [
    //   spellDarkRuneCreation,
    //   spellFireRuneCreation,
    //   spellHealRuneCreation,
    //   spellGreaterHealing,
    //   spellEnergyBoltCreation,
    //   spellFireBoltCreation,
    // ];
    // level5Spells = [spellPoisonRuneCreation, spellSelfHaste];
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(
      {
        health: 50,
        learnedSpells: [spellSelfHealing.key, spellGreaterHealing.key, rogueSpellExecution.key],
        class: CharacterClass.Rogue,
      },
      { hasEquipment: false, hasInventory: false, hasSkills: true }
    );

    await Character.findByIdAndUpdate(testCharacter.id, { class: CharacterClass.Rogue });
    const skills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;
    characterSkills = skills;
    characterSkills.level = spellSelfHealing.minLevelRequired!;
    characterSkills.magic.level = spellSelfHealing.minMagicLevelRequired;
    (await Skill.findByIdAndUpdate(characterSkills._id, characterSkills).lean()) as ISkill;

    targetCharacter = await unitTestHelper.createMockCharacter(
      { health: 100 },
      { hasEquipment: false, hasInventory: false, hasSkills: true }
    );

    sendEventToUser = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");
  });

  afterEach(() => {
    sendEventToUser.mockRestore();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("verify message is a spell being cast", () => {
    it("should be self healing spell casting", () => {
      expect(spellCast.isSpellCasting("talas faenya")).toBeTruthy();
    });

    it("should not be self healing spell casting", () => {
      expect(spellCast.isSpellCasting("talas faenya ")).toBeFalsy();
    });
  });

  it("should fail with spell not found", async () => {
    expect(await spellCast.castSpell({ magicWords: "talas faenya " }, testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, spell not found.",
      type: "error",
    });
  });
  // to edit the spell
  it("should cast spell with case case insensitive spell", async () => {
    // talas faenya as TalAs faenya
    expect(await spellCast.castSpell({ magicWords: "TalAs faenya" }, testCharacter)).toBeTruthy();
  });

  it("should call character validation", async () => {
    const characterValidationMock = jest.spyOn(CharacterValidation.prototype, "hasBasicValidation");
    characterValidationMock.mockReturnValue(false);

    expect(await spellCast.castSpell({ magicWords: "talas faenya" }, testCharacter)).toBeFalsy();
    expect(characterValidationMock).toHaveBeenLastCalledWith(testCharacter);

    characterValidationMock.mockRestore();
  });

  it("should fail with spell not learned", async () => {
    const runTest = async (): Promise<void> => {
      sendEventToUser.mockReset();

      expect(await spellCast.castSpell({ magicWords: "talas faenya" }, testCharacter)).toBeFalsy();

      expect(sendEventToUser).toBeCalledTimes(1);

      expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
        message: "Sorry, you have not learned this spell.",
        type: "error",
      });
    };

    testCharacter.learnedSpells = undefined;
    await Character.findByIdAndUpdate(testCharacter._id, { ...testCharacter });
    await runTest();

    testCharacter.learnedSpells = [];
    await Character.findByIdAndUpdate(testCharacter._id, { ...testCharacter });

    await runTest();
  });

  it("should fail with character under silence effect", async () => {
    const spellSilencerMock = jest.spyOn(SpellSilence.prototype, "isSilent");
    spellSilencerMock.mockReturnValue(Promise.resolve(true));

    expect(await spellCast.castSpell({ magicWords: "talas faenya" }, testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you are silent. You cannot cast any spell.",
      type: "error",
    });

    spellSilencerMock.mockRestore();
  });

  it("should fail with not enough mana", async () => {
    testCharacter.mana = (spellSelfHealing.manaCost ?? 1) - 1;
    await Skill.findByIdAndUpdate(testCharacter._id, { ...testCharacter });

    expect(await spellCast.castSpell({ magicWords: "talas faenya" }, testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you do not have mana to cast this spell.",
      type: "error",
    });
  });

  it("should fail due to lower character level", async () => {
    characterSkills.level = (spellSelfHealing.minLevelRequired ?? 2) - 1;
    await Skill.findByIdAndUpdate(characterSkills._id, { ...characterSkills });

    expect(await spellCast.castSpell({ magicWords: "talas faenya" }, testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you can not cast this spell at this character level.",
      type: "error",
    });
  });

  it("should fail due to lower magic level", async () => {
    characterSkills.magic.level = (spellSelfHealing.minMagicLevelRequired ?? 2) - 1;
    await Skill.findByIdAndUpdate(characterSkills._id, { ...characterSkills });

    expect(await spellCast.castSpell({ magicWords: "talas faenya" }, testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you can not cast this spell at this character magic level.",
      type: "error",
    });
  });

  it("should cast self healing spell successfully", async () => {
    const newHealth = testCharacter.health + spellSelfHealing.manaCost!;
    const newMana = testCharacter.mana - spellSelfHealing.manaCost!;

    expect(await spellCast.castSpell({ magicWords: "talas faenya" }, testCharacter)).toBeTruthy();

    const character = (await Character.findById(testCharacter.id).lean({
      virtuals: true,
      defaults: true,
    })) as ICharacter;

    expect(character.mana).toBe(newMana);

    expect(sendEventToUser).toHaveBeenCalled();

    expect(sendEventToUser).toHaveBeenCalledWith(testCharacter.channelId, AnimationSocketEvents.ShowAnimation, {
      targetId: testCharacter._id,
      effectKey: spellSelfHealing.castingAnimationKey,
    });
  });

  it("should cast Greater Healing spell successfully", async () => {
    testCharacter = await await unitTestHelper.createMockCharacter(
      { health: 50, learnedSpells: [spellGreaterHealing.key] },
      { hasEquipment: false, hasInventory: false, hasSkills: true }
    );

    testCharacter.class = CharacterClass.Druid;
    await Character.findByIdAndUpdate(testCharacter.id, testCharacter);

    const newHealth = testCharacter.health + 20;
    const newMana = testCharacter.mana - spellGreaterHealing.manaCost!;

    const skills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;
    characterSkills = skills;
    characterSkills.level = spellGreaterHealing.minLevelRequired!;
    characterSkills.magic.level = spellGreaterHealing.minMagicLevelRequired;
    await Skill.findByIdAndUpdate(characterSkills._id, { ...characterSkills });

    expect(await spellCast.castSpell({ magicWords: "greater faenya" }, testCharacter)).toBeTruthy();

    const character = (await Character.findById(testCharacter.id).lean({
      virtuals: true,
      defaults: true,
    })) as ICharacter;
    expect(character.health).toBe(newHealth);
    expect(character.mana).toBe(newMana);

    /**
     * 1. health changed event
     * 2. life heal animation event
     * 3. skill update event
     */
    expect(sendEventToUser).toHaveBeenCalled();

    expect(sendEventToUser).toHaveBeenCalledWith(testCharacter.channelId, CharacterSocketEvents.AttributeChanged, {
      targetId: testCharacter._id,
      health: newHealth,
      speed: testCharacter.speed,
      mana: newMana,
    });

    expect(sendEventToUser).toHaveBeenCalledWith(testCharacter.channelId, AnimationSocketEvents.ShowAnimation, {
      targetId: testCharacter._id,
      effectKey: spellSelfHealing.castingAnimationKey,
    });
  });

  it("should call skill increase functionality to increase character skills", async () => {
    const increaseSPMock = jest.spyOn(SkillIncrease.prototype, "increaseMagicSP");
    increaseSPMock.mockImplementation();

    expect(await spellCast.castSpell({ magicWords: "talas faenya" }, testCharacter)).toBeTruthy();

    expect(increaseSPMock).toHaveBeenCalledTimes(1);
    expect(increaseSPMock).toHaveBeenLastCalledWith(testCharacter, spellSelfHealing.manaCost!);

    increaseSPMock.mockRestore();
  });

  it("should increase skill and send skill update event", async () => {
    expect(await spellCast.castSpell({ magicWords: "talas faenya" }, testCharacter)).toBeTruthy();

    const updatedSkills: ISkill = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

    // formulate is now:  const manaSp = Math.round((spellPower * ML_INCREASE_RATIO + power) * SP_MAGIC_INCREASE_TIMES_MANA * 100) / 100;
    const skillPoints =
      SP_INCREASE_RATIO +
      SP_MAGIC_INCREASE_TIMES_MANA *
        (Math.round(spellSelfHealing.manaCost! * ML_INCREASE_RATIO) + (spellSelfHealing.manaCost ?? 0));

    const roundedSkillPoints = Math.round(skillPoints * 10) / 10;

    const lowerBound = roundedSkillPoints - 1.5;
    const upperBound = roundedSkillPoints + 1.5;
    expect(Math.round(updatedSkills?.magic.skillPoints * 10) / 10).toBeGreaterThan(lowerBound);
    expect(Math.round(updatedSkills?.magic.skillPoints * 10) / 10).toBeLessThan(upperBound);

    expect(sendEventToUser).toHaveBeenCalled();

    let skillUpdateEventParams;
    for (const call of sendEventToUser.mock.calls) {
      if (call[1] === SkillSocketEvents.ReadInfo) {
        skillUpdateEventParams = call;
        break;
      }
    }

    expect(skillUpdateEventParams).toBeDefined();

    expect(skillUpdateEventParams[0]).toBe(testCharacter.channelId);
    expect(skillUpdateEventParams[1]).toBe(SkillSocketEvents.ReadInfo);

    expect(skillUpdateEventParams[2]).toBeDefined();
    expect(skillUpdateEventParams[2].skill).toBeDefined();
    expect(skillUpdateEventParams[2].skill.magic).toBeDefined();
    expect(skillUpdateEventParams[2].skill.magic.skillPoints).toBeCloseTo(skillPoints);
  });

  it("should not cast spell if character does not have any skills", async () => {
    testCharacter.skills = undefined;
    await Character.findByIdAndUpdate(testCharacter._id, { ...testCharacter });

    expect(await spellCast.castSpell({ magicWords: "talas faenya" }, testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you can not cast this spell without any skills.",
      type: "error",
    });
  });

  it("should send identify target for ranged spells", async () => {
    testCharacter.learnedSpells = [SpellsBlueprint.WarriorStunTarget];
    testCharacter.class = CharacterClass.Warrior;
    await testCharacter.save();

    const skills = (await Skill.findById(testCharacter.skills)) as ISkill;
    skills.level = 99;
    skills.magic.level = 99;
    await skills?.save();

    const spell = { magicWords: "talas tamb-eth" };
    expect(await spellCast.castSpell(spell, testCharacter)).toBeFalsy();

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, SpellSocketEvents.IdentifyTarget, spell);
  });

  it("should add spells to learned spells (level 2 character)", async () => {
    const runTest = async (): Promise<void> => {
      await spellLearn.learnLatestSkillLevelSpells(testCharacter._id, false);

      const character = (await Character.findOne({ _id: testCharacter._id }).populate(
        "skills"
      )) as unknown as ICharacter;
      const skills = character.skills as unknown as ISkill;

      expect(skills.level).toBe(2);
      expect(character.learnedSpells).toBeDefined();
      expect([...character.learnedSpells!]).toEqual(level2Spells.map((spell) => spell.key));

      expect(sendEventToUser).not.toHaveBeenCalled();
    };

    testCharacter.learnedSpells = undefined;
    await Character.findByIdAndUpdate(testCharacter._id, { ...testCharacter });
    await runTest();
  });

  it("should add spells to learned spells (level 2 character) and notify user", async () => {
    const runTest = async (): Promise<void> => {
      await spellLearn.learnLatestSkillLevelSpells(testCharacter._id, true);

      const character = (await Character.findOne({ _id: testCharacter._id }).populate(
        "skills"
      )) as unknown as ICharacter;
      const skills = character.skills as unknown as ISkill;

      expect(skills.level).toBe(2);
      expect(character.learnedSpells).toBeDefined();
      expect([...character.learnedSpells!]).toEqual(level2Spells.map((spell) => spell.key));

      const learned = level2Spells.map((spell) => spell.name + " (" + spell.magicWords + ")").join(", ");
      expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
        message: "You have learned new spell(s): " + learned,
        type: "info",
      });
    };

    testCharacter.learnedSpells = undefined;
    await Character.findByIdAndUpdate(testCharacter._id, { ...testCharacter });
    await runTest();
  });

  it("should not duplicate spells on append (level 2 character)", async () => {
    const runTest = async (): Promise<void> => {
      await spellLearn.learnLatestSkillLevelSpells(testCharacter._id, false);

      const character = (await Character.findOne({ _id: testCharacter._id }).populate(
        "skills"
      )) as unknown as ICharacter;
      const skills = character.skills as unknown as ISkill;

      expect(skills.level).toBe(2);
      expect(character.learnedSpells).toBeDefined();
      expect([...character.learnedSpells!]).toEqual(level2Spells.map((spell) => spell.key));
    };

    testCharacter.learnedSpells = [spellSelfHealing.key!, spellArrowCreation.key!, spellBlankRuneCreation.key!];
    await Character.findByIdAndUpdate(testCharacter._id, { ...testCharacter });
    await runTest();
  });

  it("should not add any spell to character (level 1 character)", async () => {
    const runTest = async (): Promise<void> => {
      await spellLearn.learnLatestSkillLevelSpells(testCharacter._id, true);

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
    await Character.findByIdAndUpdate(testCharacter._id, { ...testCharacter });

    characterSkills.level = 1;
    await Skill.findByIdAndUpdate(characterSkills._id, { ...characterSkills });

    await runTest();
  });

  it("should call special effect invisible", async () => {
    const timerMock = jest.spyOn(TimerWrapper.prototype, "setTimeout");
    timerMock.mockImplementation();

    expect(await specialEffect.isInvisible(testCharacter)).toBeFalsy();

    await spellStealth.usableEffect!(testCharacter);

    expect(await specialEffect.isInvisible(testCharacter)).toBeTruthy();

    expect(timerMock).toHaveBeenCalled();

    const skills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;
    const timeout = Math.min(Math.max(skills.magic.level * 1.5, 10), 180);
    expect(timerMock.mock.calls[0][1]).toBe(timeout * 2000);

    await timerMock.mock.calls[0][0]();
    expect(await specialEffect.isInvisible(testCharacter)).toBeFalsy();
  });

  describe("ranged spells", () => {
    let targetNPC: INPC;

    beforeEach(async () => {
      testCharacter.learnedSpells = [SpellsBlueprint.WarriorStunTarget];

      testCharacter.class = CharacterClass.Warrior;
      await Character.findByIdAndUpdate(testCharacter.id, testCharacter);

      const skills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;
      characterSkills = skills;
      characterSkills.level = spellStunTarget.minLevelRequired!;
      characterSkills.magic.level = spellStunTarget.minMagicLevelRequired;
      (await Skill.findByIdAndUpdate(characterSkills._id, characterSkills).lean()) as ISkill;

      targetNPC = await unitTestHelper.createMockNPC({ health: 5 }, { hasSkills: true });
    });

    it("should  not cast spell if the target is not valid", async () => {
      const spell = { magicWords: "talas tamb-eth", targetId: targetCharacter._id, targetType: EntityType.NPC };
      expect(await spellCast.castSpell(spell, testCharacter)).toBeFalsy();

      expect(sendEventToUser).toHaveBeenCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
        message: "Sorry, you need to select a valid target to cast this spell.",
        type: "error",
      });
    });

    it("should  not cast spell if the target is out of reach", async () => {
      await Character.updateOne(
        { _id: targetCharacter._id },
        {
          $set: {
            x: targetCharacter.x + (spellStunTarget.maxDistanceGrid! + 1) * GRID_WIDTH,
          },
        }
      );

      const spell = { magicWords: "talas tamb-eth", targetId: targetCharacter._id, targetType: EntityType.Character };
      expect(await spellCast.castSpell(spell, testCharacter)).toBeFalsy();

      expect(sendEventToUser).toHaveBeenCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
        message: "Sorry, your target is out of reach.",
        type: "error",
      });
    });

    it("should  not cast spell on friendly npc", async () => {
      const testNPC = await unitTestHelper.createMockNPC(
        { alignment: NPCAlignment.Friendly },
        null,
        NPCMovementType.Stopped
      );

      const spell = { magicWords: "talas tamb-eth", targetId: testNPC._id, targetType: EntityType.NPC };
      expect(await spellCast.castSpell(spell, testCharacter)).toBeFalsy();
    });

    it("should  stun a target successfully", async () => {
      const timerMock = jest.spyOn(TimerWrapper.prototype, "setTimeout");
      timerMock.mockImplementation();

      await Skill.findByIdAndUpdate(targetCharacter.skills, { level: 8 });
      await Skill.findByIdAndUpdate(testCharacter.skills, { level: 8 });

      const spell = { magicWords: "talas tamb-eth", targetId: targetCharacter._id, targetType: EntityType.Character };
      expect(await spellCast.castSpell(spell, testCharacter)).toBeTruthy();

      expect(sendEventToUser).toHaveBeenCalledWith(
        testCharacter.channelId,
        AnimationSocketEvents.ShowProjectileAnimation,
        {
          targetId: targetCharacter._id,
          projectileEffectKey: spellStunTarget.projectileAnimationKey,
          sourceId: testCharacter._id,
        }
      );

      expect(await specialEffect.isStun(targetCharacter)).toBeTruthy();

      expect(timerMock).toHaveBeenCalled();

      expect(timerMock.mock.calls[0][1]).toBe(11000);

      await timerMock.mock.calls[0][0]();
      expect(await specialEffect.isStun(targetCharacter)).toBeFalsy();
    });

    it("should not be able stun itself", async () => {
      const timerMock = jest.spyOn(TimerWrapper.prototype, "setTimeout");
      timerMock.mockImplementation();

      const spell = { magicWords: "talas tamb-eth", targetId: testCharacter._id, targetType: EntityType.Character };
      expect(await spellCast.castSpell(spell, testCharacter)).toBeFalsy();

      expect(await specialEffect.isStun(targetCharacter)).toBeFalsy();

      expect(timerMock).not.toHaveBeenCalled();
    });

    it("should not execute spell in yourself", async () => {
      const timerMock = jest.spyOn(TimerWrapper.prototype, "setTimeout");
      timerMock.mockImplementation();

      await berserkerSpells.handleBerserkerExecution(testCharacter, testCharacter);

      const characterBody = await Item.findOne({
        name: `${testCharacter.name}'s body`,
        scene: testCharacter.scene,
      })
        .populate("itemContainer")
        .exec();

      expect(characterBody).toBeNull();

      expect(testCharacter.health).toBe(50);
      expect(testCharacter.isAlive).toBe(true);
    });

    it("should execute spell successfully for a character target health <= 30% ", async () => {
      testCharacter.mode = Modes.HardcoreMode;
      await testCharacter.save();

      const timerMock = jest.spyOn(TimerWrapper.prototype, "setTimeout");
      timerMock.mockImplementation();

      targetCharacter.health = 25;
      await Character.findByIdAndUpdate(targetCharacter._id, targetCharacter);

      await berserkerSpells.handleBerserkerExecution(testCharacter, targetCharacter);

      const characterBody = await Item.findOne({
        name: `${targetCharacter.name}'s body`,
        scene: targetCharacter.scene,
      })
        .populate("itemContainer")
        .exec();

      expect(characterBody).not.toBeNull();
    });
  });

  // describe("test item creation spell invocation", () => {
  //   beforeEach(async () => {
  //     testCharacter = await (
  //       await unitTestHelper.createMockCharacter(
  //         {
  //           health: 50,
  //           learnedSpells: level2Spells.concat(level3Spells, level4Spells, level5Spells).map((spell) => spell.key),
  //         },
  //         { hasEquipment: true, hasInventory: true, hasSkills: true }
  //       )
  //     )
  //       .populate("skills")
  //       .execPopulate();

  //     characterSkills = testCharacter.skills as unknown as ISkill;
  //     characterSkills.level = spellFoodCreation.minLevelRequired!;
  //     characterSkills.magic.level = spellFoodCreation.minMagicLevelRequired;
  //     await Skill.findByIdAndUpdate(characterSkills._id, { ...characterSkills });
  //   });

  //   it("should cast food creation spell successfully", async () => {
  //     expect(await spellCast.castSpell({magicWords: "iquar klatha"}, testCharacter)).toBeTruthy();

  //     const inventory = await testCharacter.inventory;
  //     const container = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

  //     const item = container.slots[0];
  //     expect(item).toBeDefined();
  //     expect(item?.subType).toBe(ItemSubType.Food);

  //     expect(sendEventToUser).toHaveBeenCalledWith(
  //       testCharacter.channelId!,
  //       ItemSocketEvents.EquipmentAndInventoryUpdate,
  //       {
  //         inventory: container,
  //         openInventoryOnUpdate: false,
  //       }
  //     );
  //   });

  //   it("should cast arrow creation spell successfully", async () => {
  //     expect(await spellCast.castSpell({magicWords: "iquar elandi"}, testCharacter)).toBeTruthy();

  //     const inventory = await testCharacter.inventory;
  //     const container = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

  //     const item = container.slots[0];
  //     expect(item).toBeDefined();
  //     expect(item?.key).toBe(RangedWeaponsBlueprint.Arrow);

  //     expect(sendEventToUser).toHaveBeenCalledWith(
  //       testCharacter.channelId!,
  //       ItemSocketEvents.EquipmentAndInventoryUpdate,
  //       {
  //         inventory: container,
  //         openInventoryOnUpdate: false,
  //       }
  //     );
  //   });

  //   it("should cast bolt creation spell successfully", async () => {
  //     expect(await spellCast.castSpell({magicWords: "iquar lyn"}, testCharacter)).toBeTruthy();

  //     const inventory = await testCharacter.inventory;
  //     const container = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

  //     const item = container.slots[0];
  //     expect(item).toBeDefined();
  //     expect(item?.key).toBe(RangedWeaponsBlueprint.Bolt);

  //     expect(sendEventToUser).toHaveBeenCalledWith(
  //       testCharacter.channelId!,
  //       ItemSocketEvents.EquipmentAndInventoryUpdate,
  //       {
  //         inventory: container,
  //         openInventoryOnUpdate: false,
  //       }
  //     );
  //   });

  //   it("should cast rune creation spell successfully", async () => {
  //     expect(await spellCast.castSpell({magicWords: "iquar ansr ki"}, testCharacter)).toBeTruthy();

  //     const inventory = await testCharacter.inventory;
  //     const container = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

  //     const item = container.slots[0];
  //     expect(item).toBeDefined();
  //     expect(item?.key).toBe(MagicsBlueprint.Rune);

  //     expect(sendEventToUser).toHaveBeenCalledWith(
  //       testCharacter.channelId!,
  //       ItemSocketEvents.EquipmentAndInventoryUpdate,
  //       {
  //         inventory: container,
  //         openInventoryOnUpdate: false,
  //       }
  //     );
  //   });

  //   it("should be self haste spell casting", () => {
  //     expect(spellCast.isSpellCasting("talas hiz")).toBeTruthy();
  //   });

  //   it("should cast haste spell successfully", async () => {
  //     jest.useFakeTimers({ advanceTimers: true });

  //     testCharacter = await unitTestHelper.createMockCharacter(
  //       { health: 50, learnedSpells: [spellSelfHaste.key] },
  //       { hasEquipment: true, hasInventory: true, hasSkills: true }
  //     );

  //     await testCharacter.populate("skills").execPopulate();

  //     characterSkills = testCharacter.skills as unknown as ISkill;
  //     characterSkills.level = spellSelfHaste.minLevelRequired!;
  //     characterSkills.magic.level = spellSelfHaste.minMagicLevelRequired;
  //     await Skill.findByIdAndUpdate(characterSkills._id, { ...characterSkills });

  //     const castResult = await spellCast.castSpell({magicWords: "talas hiz"}, testCharacter);

  //     expect(castResult).toBeTruthy();

  //     expect(testCharacter.baseSpeed).toBe(3);
  //     expect(testCharacter.speed).toBe(3);

  //     expect(sendEventToUser).toHaveBeenNthCalledWith(
  //       2,
  //       testCharacter.channelId,
  //       CharacterSocketEvents.AttributeChanged,
  //       {
  //         targetId: testCharacter._id,
  //         health: testCharacter.health,
  //         mana: testCharacter.mana,
  //         speed: testCharacter.speed,
  //       }
  //     );

  //     expect(sendEventToUser).toHaveBeenNthCalledWith(4, testCharacter.channelId, AnimationSocketEvents.ShowAnimation, {
  //       targetId: testCharacter._id,
  //       effectKey: spellSelfHaste.animationKey,
  //     });

  //     jest.clearAllTimers();
  //   });
  // });
});
