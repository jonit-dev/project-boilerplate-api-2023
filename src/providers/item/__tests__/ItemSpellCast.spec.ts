import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { ItemSpellCast } from "../ItemSpellCast";
import { AnimationSocketEvents, CharacterSocketEvents, UISocketEvents } from "@rpg-engine/shared";
import { itemSelfHealing } from "../data/blueprints/spells/ItemSelfHealing";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";

describe("ItemSpellCast.ts", () => {
  let itemSpellCast: ItemSpellCast;
  let testCharacter: ICharacter;
  let characterSkills: ISkill;
  let sendEventToUser: jest.SpyInstance;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemSpellCast = container.get<ItemSpellCast>(ItemSpellCast);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await (
      await unitTestHelper.createMockCharacter(
        { health: 50, learnedSpells: [itemSelfHealing.key] },
        { hasEquipment: false, hasInventory: false, hasSkills: true }
      )
    )
      .populate("skills")
      .execPopulate();

    characterSkills = testCharacter.skills as unknown as ISkill;
    characterSkills.level = itemSelfHealing.minLevelRequired!;
    characterSkills.magic.level = itemSelfHealing.minMagicLevelRequired;
    await characterSkills.save();

    sendEventToUser = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");
  });

  afterEach(() => {
    sendEventToUser.mockRestore();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });

  describe("verify message is a spell being cast", () => {
    it("should be self healing spell casting", async () => {
      expect(await itemSpellCast.isSpellCasting("heal me now")).toBeTruthy();
    });

    it("should not be self healing spell casting", async () => {
      expect(await itemSpellCast.isSpellCasting("heal me now ")).toBeFalsy();
    });
  });

  it("should fail with spell not found", async () => {
    expect(await itemSpellCast.castSpell("heal me now ", testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, spell not found.",
      type: "error",
    });
  });

  it("should call character validation", async () => {
    const characterValidationMock = jest.spyOn(CharacterValidation.prototype, "hasBasicValidation");
    characterValidationMock.mockReturnValue(false);

    expect(await itemSpellCast.castSpell("heal me now", testCharacter)).toBeFalsy();
    expect(characterValidationMock).toHaveBeenLastCalledWith(testCharacter);

    characterValidationMock.mockRestore();
  });

  it("should fail with spell not learned", async () => {
    const runTest = async (): Promise<void> => {
      sendEventToUser.mockReset();

      expect(await itemSpellCast.castSpell("heal me now", testCharacter)).toBeFalsy();

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
    testCharacter.mana = (itemSelfHealing.manaCost ?? 1) - 1;
    await testCharacter.save();

    expect(await itemSpellCast.castSpell("heal me now", testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you do not have mana to cast this spell.",
      type: "error",
    });
  });

  it("should fail due to lower character level", async () => {
    characterSkills.level = (itemSelfHealing.minLevelRequired ?? 2) - 1;
    await characterSkills.save();

    expect(await itemSpellCast.castSpell("heal me now", testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you can not cast this spell at this character level.",
      type: "error",
    });
  });

  // TODO: Implement magic level validation later
  /* it("should fail due to lower magic level", async () => {
    characterSkills.magic.level = (itemSelfHealing.minMagicLevelRequired ?? 2) - 1;
    await characterSkills.save();

    expect(await itemSpellCast.castSpell("heal me now", testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you can not cast this spell at this character magic level.",
      type: "error",
    });
  }); */

  it("should cast self healing spell successfully", async () => {
    const newHealth = testCharacter.health + itemSelfHealing.manaCost!;
    const newMana = testCharacter.mana - itemSelfHealing.manaCost!;

    expect(await itemSpellCast.castSpell("heal me now", testCharacter)).toBeTruthy();

    const character = (await Character.findById(testCharacter.id)) as unknown as ICharacter;
    expect(character.health).toBe(newHealth);
    expect(character.mana).toBe(newMana);

    expect(sendEventToUser).toBeCalledTimes(2);

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
      effectKey: itemSelfHealing.animationKey,
    });
  });

  it("should add spells to learned spells (level 2 character)", async () => {
    const runTest = async (): Promise<void> => {
      await itemSpellCast.learnLatestSkillLevelSpells(testCharacter);

      const character = (await Character.findOne({ _id: testCharacter._id }).populate(
        "skills"
      )) as unknown as ICharacter;
      const skills = character.skills as unknown as ISkill;

      expect(skills.level).toBe(2);
      expect(character.learnedSpells).toBeDefined();
      expect([...character.learnedSpells!]).toEqual([itemSelfHealing.key]);
    };

    testCharacter.learnedSpells = undefined;
    await testCharacter.save();
    await runTest();
  });

  it("should not duplicate spells on append (level 2 character)", async () => {
    const runTest = async (): Promise<void> => {
      await itemSpellCast.learnLatestSkillLevelSpells(testCharacter);

      const character = (await Character.findOne({ _id: testCharacter._id }).populate(
        "skills"
      )) as unknown as ICharacter;
      const skills = character.skills as unknown as ISkill;

      expect(skills.level).toBe(2);
      expect(character.learnedSpells).toBeDefined();
      expect([...character.learnedSpells!]).toEqual([itemSelfHealing.key]);
    };

    testCharacter.learnedSpells = [itemSelfHealing.key!];
    await testCharacter.save();
    await runTest();
  });

  it("should not add any spell to character (level 1 character)", async () => {
    const runTest = async (): Promise<void> => {
      await itemSpellCast.learnLatestSkillLevelSpells(testCharacter);

      const character = (await Character.findOne({ _id: testCharacter._id }).populate(
        "skills"
      )) as unknown as ICharacter;
      const skills = character.skills as unknown as ISkill;

      expect(skills.level).toBe(1);
      expect(character.learnedSpells).toBeDefined();
      expect([...character.learnedSpells!]).toEqual([]);
    };

    testCharacter.learnedSpells = undefined;
    await testCharacter.save();

    characterSkills.level = 1;
    await characterSkills.save();

    await runTest();
  });
});
