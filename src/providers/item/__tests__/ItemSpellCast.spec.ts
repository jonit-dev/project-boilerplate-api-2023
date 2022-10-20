import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { ItemSpellCast } from "../ItemSpellCast";
import { AnimationEffectKeys, UISocketEvents } from "@rpg-engine/shared";
import { itemSelfHealing } from "../data/blueprints/spells/ItemSelfHealing";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";

describe("ItemSpellCast.ts", () => {
  let itemSpellCast: ItemSpellCast;
  let testCharacter: ICharacter;
  let characterSkills: ISkill;
  let sendEventToUser: jest.SpyInstance;
  let animationEventMock: jest.SpyInstance;

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
    characterSkills.level = itemSelfHealing.minLevelRequired;
    characterSkills.magic.level = itemSelfHealing.minMagicLevelRequired;
    await characterSkills.save();

    sendEventToUser = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");

    // animationEventMock = jest.spyOn(AnimationEffect.prototype, "sendAnimationEvent");
    // animationEventMock.mockImplementation();
  });

  afterEach(() => {
    sendEventToUser.mockRestore();
    // animationEventMock.mockRestore();
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

  it("should fail due to lower magic level", async () => {
    characterSkills.magic.level = (itemSelfHealing.minMagicLevelRequired ?? 2) - 1;
    await characterSkills.save();

    expect(await itemSpellCast.castSpell("heal me now", testCharacter)).toBeFalsy();

    expect(sendEventToUser).toBeCalledTimes(1);

    expect(sendEventToUser).toHaveBeenLastCalledWith(testCharacter.channelId, UISocketEvents.ShowMessage, {
      message: "Sorry, you can not cast this spell at this character magic level.",
      type: "error",
    });
  });
});
