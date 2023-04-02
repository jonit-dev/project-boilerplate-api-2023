import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { SP_INCREASE_RATIO, SP_MAGIC_INCREASE_TIMES_MANA } from "@providers/constants/SkillConstants";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemDarkRune } from "@providers/item/data/blueprints/magics/ItemDarkRune";
import { StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SpellLearn } from "@providers/spells/SpellLearn";
import { spellSelfHealing } from "@providers/spells/data/blueprints/all/SpellSelfHealing";
import {
  BasicAttribute,
  CharacterClass,
  ItemSubType,
  calculateSPToNextLevel,
  calculateXPToNextLevel,
} from "@rpg-engine/shared";
import { Error } from "mongoose";
import { SkillFunctions } from "../SkillFunctions";
import { SkillIncrease } from "../SkillIncrease";
import { CraftingSkillsMap } from "../constants";

type TestCase = {
  item: string;
  skill: string;
};

const simpleTestCases: TestCase[] = [
  {
    item: ItemSubType.Sword,
    skill: "sword",
  },
  {
    item: ItemSubType.Dagger,
    skill: "dagger",
  },
  {
    item: ItemSubType.Axe,
    skill: "axe",
  },
  {
    item: ItemSubType.Ranged,
    skill: "distance",
  },
  {
    item: ItemSubType.Spear,
    skill: "distance",
  },
  {
    item: ItemSubType.Shield,
    skill: "shielding",
  },
  {
    item: ItemSubType.Mace,
    skill: "club",
  },
  {
    item: BasicAttribute.Strength,
    skill: BasicAttribute.Strength,
  },
  {
    item: BasicAttribute.Dexterity,
    skill: BasicAttribute.Dexterity,
  },
  {
    item: BasicAttribute.Resistance,
    skill: BasicAttribute.Resistance,
  },
];

describe("SkillIncrease.spec.ts | increaseSP test cases", () => {
  let skillIncrease: SkillIncrease;
  let skills: ISkill;
  let initialLevel: number;
  let spToLvl2: number;

  beforeAll(() => {
    skillIncrease = container.get<SkillIncrease>(SkillIncrease);

    initialLevel = 1;
    spToLvl2 = calculateSPToNextLevel(0, initialLevel + 1);

    expect(spToLvl2).toBeGreaterThan(0);
  });

  beforeEach(() => {
    skills = new Skill({
      ownerType: "Character",
    }) as ISkill;
  });

  it("should throw error when passing not a weapon item", () => {
    try {
      // @ts-ignore
      skillIncrease.increaseSP(skills, ItemSubType.Potion);
      throw new Error("this should have failed");
    } catch (error: any | Error) {
      expect(error.message).toBe(`skill not found for item subtype ${ItemSubType.Potion}`);
    }
  });

  for (const test of simpleTestCases) {
    it(`should increase '${test.skill}' skill points | Item: ${test.item}`, () => {
      expect(skills[test.skill].level).toBe(initialLevel);
      expect(skills[test.skill].skillPoints).toBe(0);

      // @ts-ignore
      let increasedSkills;
      for (let i = 0; i < spToLvl2 * 5; i++) {
        // @ts-ignore
        increasedSkills = skillIncrease.increaseSP(skills, test.item);
      }

      expect(increasedSkills.skillLevelUp).toBe(true);
      expect(increasedSkills.skillName).toBe(test.skill);
      expect(increasedSkills.skillLevelBefore).toBe(initialLevel);
      expect(increasedSkills.skillLevelAfter).toBe(initialLevel + 1);

      expect(skills[test.skill].level).toBe(initialLevel + 1);
      expect(skills[test.skill].skillPoints).toBe(spToLvl2);

      expect(skills[test.skill].skillPointsToNextLevel).toBe(calculateSPToNextLevel(spToLvl2, initialLevel + 2));
    });
  }
});

describe("SkillIncrease.spec.ts | increaseShieldingSP, increaseSkillsOnBattle & increaseCraftingSkills test cases", () => {
  let skillIncrease: SkillIncrease,
    testCharacter: ICharacter,
    testNPC: INPC,
    initialSkills: ISkill,
    initialLevel: number,
    spToLvl2: number,
    spToLvl3: number,
    xpToLvl2: number,
    sendSkillLevelUpEvents: jest.SpyInstance,
    sendExpLevelUpEvents: any,
    spellLearnMock: jest.SpyInstance;

  beforeAll(() => {
    skillIncrease = container.get<SkillIncrease>(SkillIncrease);

    initialSkills = new Skill({
      ownerType: "Character",
    }) as ISkill;
    initialLevel = initialSkills.first.level;

    spToLvl2 = calculateSPToNextLevel(initialSkills.first.skillPoints, initialLevel + 1);
    spToLvl3 = calculateSPToNextLevel(spToLvl2, initialLevel + 2);
    xpToLvl2 = calculateXPToNextLevel(initialSkills.experience, initialSkills.level + 1);

    expect(spToLvl2).toBeGreaterThan(0);
    expect(spToLvl3).toBeGreaterThan(spToLvl2);
    expect(xpToLvl2).toBeGreaterThan(0);

    sendSkillLevelUpEvents = jest.spyOn(SkillFunctions.prototype, "sendSkillLevelUpEvents" as any);
    sendExpLevelUpEvents = jest.spyOn(skillIncrease, "sendExpLevelUpEvents" as any);
    spellLearnMock = jest.spyOn(SpellLearn.prototype, "learnLatestSkillLevelSpells");
    spellLearnMock.mockImplementation();
  });

  afterAll(() => {
    spellLearnMock.mockRestore();
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasSkills: true, hasEquipment: true });

    testCharacter.class = CharacterClass.Druid;

    testNPC = await unitTestHelper.createMockNPC();
  });

  it("should not increase character's 'shielding' skill | Character without Shield", async () => {
    await skillIncrease.increaseShieldingSP(testCharacter);

    const updatedSkills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

    // Check that skills remained unchanged
    expect(updatedSkills.shielding.level).toBe(initialLevel);
    expect(updatedSkills.shielding.skillPoints).toBe(initialSkills.shielding.skillPoints);
    expect(updatedSkills.shielding.skillPointsToNextLevel).toBe(spToLvl2);
    expect(updatedSkills.axe.level).toBe(initialLevel);
    expect(updatedSkills.axe.skillPoints).toBe(initialSkills.axe.skillPoints);
    expect(updatedSkills.distance.level).toBe(initialLevel);
    expect(updatedSkills.distance.skillPoints).toBe(initialSkills.distance.skillPoints);
    expect(updatedSkills.sword.level).toBe(initialLevel);
    expect(updatedSkills.sword.skillPoints).toBe(initialSkills.sword.skillPoints);
    expect(updatedSkills.first.level).toBe(initialLevel);
    expect(updatedSkills.first.skillPoints).toBe(initialSkills.first.skillPoints);

    expect(sendSkillLevelUpEvents).not.toHaveBeenCalled();
    expect(sendExpLevelUpEvents).not.toHaveBeenCalled();

    expect(spellLearnMock).not.toHaveBeenCalled();
    // faking timers is creating issue with mongo calls
    await wait(5.2);
    expect(spellLearnMock).not.toHaveBeenCalled();
  });

  it("should increase character's 'first' skill points and should not increase xp (damage 0)", async () => {
    await skillIncrease.increaseSkillsOnBattle(testCharacter, testNPC, 0);

    const updatedSkills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

    expect(testNPC.xpToRelease?.length).toBe(0);
    expect(updatedSkills.first.level).toBe(initialLevel);
    expect(updatedSkills.first.skillPoints).toBe(SP_INCREASE_RATIO + 0.2);
    expect(updatedSkills.first.skillPointsToNextLevel).toBe(spToLvl2 - SP_INCREASE_RATIO - 0.2);
    expect(updatedSkills.level).toBe(initialLevel);
    expect(updatedSkills.experience).toBe(initialSkills.experience);
    expect(updatedSkills.xpToNextLevel).toBe(xpToLvl2);

    expect(sendSkillLevelUpEvents).not.toHaveBeenCalled();
    expect(sendExpLevelUpEvents).not.toHaveBeenCalled();

    expect(spellLearnMock).not.toHaveBeenCalled();
    // faking timers is creating issue with mongo calls
    await wait(5.2);
    expect(spellLearnMock).not.toHaveBeenCalled();
  });

  it("should increase character's skill level - 'first' & strength skills. Should not increase XP (not released)", async () => {
    await skillIncrease.increaseSkillsOnBattle(testCharacter, testNPC, 1);

    const updatedSkills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

    // 'first' skill should increase
    expect(updatedSkills.first.level).toBe(initialLevel);
    expect(updatedSkills.first.skillPoints).toBe(SP_INCREASE_RATIO + 0.2);
    expect(updatedSkills.first.skillPointsToNextLevel).toBe(spToLvl2 - SP_INCREASE_RATIO - 0.2);

    // strength should increase too
    expect(updatedSkills.strength.level).toBe(initialLevel);
    expect(updatedSkills.strength.skillPoints).toBe(SP_INCREASE_RATIO + 0.16);
    expect(updatedSkills.strength.skillPointsToNextLevel).toBe(spToLvl2 - SP_INCREASE_RATIO - 0.16);

    // Without releasing the XP, experience values should be same as initial values
    // and NPC's xpToRelease array should have a length == 1
    expect(updatedSkills.level).toBe(initialLevel);
    expect(updatedSkills.experience).toBe(initialSkills.experience);
    expect(updatedSkills.xpToNextLevel).toBe(xpToLvl2);
    expect(testNPC.xpToRelease?.length).toBe(1);
  });

  it("should increase character's 'first' skill level and skill points. Should increase experience and level up to level 5", async () => {
    const spToAdd = spToLvl2 * 5 + 5;
    const teste = (await Character.findByIdAndUpdate(
      { _id: testCharacter._id },
      { class: CharacterClass.Druid },
      { new: true }
    )) as ICharacter;
    for (let i = 0; i < spToAdd; i++) {
      await skillIncrease.increaseSkillsOnBattle(teste, testNPC, 2);
    }
    await skillIncrease.releaseXP(testNPC);

    const updatedSkills = (await Skill.findById(teste.skills).lean()) as ISkill;

    expect(updatedSkills.first.level).toBe(initialLevel + 1);
    expect(updatedSkills.first.skillPoints).toBe(spToAdd * SP_INCREASE_RATIO + 35);
    expect(updatedSkills.first.skillPointsToNextLevel).toBe(spToLvl2 - 5.75);

    expect(updatedSkills.level).toBe(initialLevel + 3);
    expect(updatedSkills.experience).toBe(spToAdd * 2);
    expect(updatedSkills.xpToNextLevel).toBe(145);
    expect(testNPC.xpToRelease?.length).toBe(0);

    expect(sendSkillLevelUpEvents).toHaveBeenCalled();
    expect(sendExpLevelUpEvents).toHaveBeenCalled();

    expect(spellLearnMock).not.toHaveBeenCalled();
    // faking timers is creating issue with mongo calls
    await wait(5.2);
    expect(spellLearnMock).toHaveBeenCalledTimes(1);
    expect(spellLearnMock).toHaveBeenCalledWith(teste._id, true);

    // Check that other skills remained unchanged
    expect(updatedSkills.axe.level).toBe(initialSkills.axe.level);
    expect(updatedSkills.axe.skillPoints).toBe(initialSkills.axe.skillPoints);
    expect(updatedSkills.distance.level).toBe(initialSkills.distance.level);
    expect(updatedSkills.distance.skillPoints).toBe(initialSkills.distance.skillPoints);
    expect(updatedSkills.sword.level).toBe(initialSkills.sword.level);
    expect(updatedSkills.sword.skillPoints).toBe(initialSkills.sword.skillPoints);
    expect(updatedSkills.shielding.level).toBe(initialSkills.shielding.level);
    expect(updatedSkills.shielding.skillPoints).toBe(initialSkills.shielding.skillPoints);
  });

  it("should increase character's magic skill level and not strength.", async () => {
    const characterEquipment = (await Equipment.findById(testCharacter.equipment).lean()) as IEquipment;

    const staff = await unitTestHelper.createMockItemFromBlueprint(StaffsBlueprint.MoonsStaff);
    characterEquipment.rightHand = staff.id;

    await Equipment.findByIdAndUpdate(testCharacter.equipment, characterEquipment);

    await skillIncrease.increaseSkillsOnBattle(testCharacter, testNPC, 1);

    const updatedSkills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

    // magic skill should increase
    expect(updatedSkills.magic.level).toBe(initialLevel);
    expect(updatedSkills.magic.skillPoints).toBe(SP_INCREASE_RATIO + 0.52);
    expect(updatedSkills.magic.skillPointsToNextLevel).toBe(spToLvl2 - SP_INCREASE_RATIO - 0.52);

    // strength should not increase
    expect(updatedSkills.strength.level).toBe(initialLevel);
    expect(updatedSkills.strength.skillPoints).toBe(0);
    expect(updatedSkills.strength.skillPointsToNextLevel).toBe(spToLvl2);
  });

  it("should increase character's resistance SP", async () => {
    await skillIncrease.increaseBasicAttributeSP(testCharacter, BasicAttribute.Resistance);

    const updatedSkills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

    // 'resistance' skill should increase
    expect(updatedSkills.resistance.level).toBe(initialLevel);
    expect(updatedSkills.resistance.skillPoints).toBe(SP_INCREASE_RATIO + 0.16);
    expect(updatedSkills.resistance.skillPointsToNextLevel).toBe(spToLvl2 - SP_INCREASE_RATIO - 0.16);
  });

  it("should increase character's magic SP as per mana cost", async () => {
    await skillIncrease.increaseMagicSP(testCharacter, spellSelfHealing.manaCost!);

    const updatedSkills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

    // 'magic' skill should increase
    expect(updatedSkills.magic.level).toBe(initialLevel);

    const skillPoints = SP_INCREASE_RATIO + SP_MAGIC_INCREASE_TIMES_MANA * (spellSelfHealing.manaCost ?? 0);
    expect(updatedSkills.magic.skillPoints).toBe(skillPoints + 0.52);
    expect(updatedSkills.magic.skillPointsToNextLevel).toBe(spToLvl2 - (skillPoints + 0.52));
  });

  it("should increase character's magic resistance SP as per rune power", async () => {
    await skillIncrease.increaseMagicResistanceSP(testCharacter, itemDarkRune.power!);

    const updatedSkills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

    // 'magic resistance' skill should increase
    expect(updatedSkills.magicResistance.level).toBe(initialLevel);

    // @ts-ignore
    itemDarkRune.power = 20;

    const skillPoints = SP_INCREASE_RATIO + SP_MAGIC_INCREASE_TIMES_MANA * (itemDarkRune.power ?? 0);
    expect(Math.round(updatedSkills?.magicResistance.skillPoints * 10) / 10).toBeCloseTo(8.7);
    expect(updatedSkills?.magicResistance.skillPointsToNextLevel).toBeCloseTo(spToLvl2 - 8.72);
  });

  it("target level should influence gained SP", async () => {
    const testCases = [
      {
        skills: new Skill({
          ownerType: "NPC",
          level: 1,
        }),
        exp: SP_INCREASE_RATIO + 0.2,
      },
      {
        skills: new Skill({
          ownerType: "NPC",
          level: 51,
        }),
        exp: SP_INCREASE_RATIO + 1.6,
      },
      {
        skills: new Skill({
          ownerType: "NPC",
          level: 101,
        }),
        exp: SP_INCREASE_RATIO + 4,
      },
    ];

    for (const tc of testCases) {
      // update NPCs skills
      const res = await tc.skills.save();
      testNPC.skills = res._id;
      await testNPC.save();

      // reset character's skills on every test
      let charSkills = new Skill({
        ownerType: "Character",
      });
      charSkills = await charSkills.save();
      await Character.findByIdAndUpdate(testCharacter._id, { skills: charSkills._id });

      // increase skills
      await skillIncrease.increaseSkillsOnBattle(testCharacter, testNPC, 0);
      const updatedSkills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

      expect(updatedSkills.first.skillPoints).toBe(tc.exp);
    }
  });

  CraftingSkillsMap.forEach((skill, itemKey) => {
    it(`item ${itemKey} should increase character's ${skill} skill`, async () => {
      await skillIncrease.increaseCraftingSP(testCharacter, itemKey);

      const updatedSkills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

      expect(updatedSkills[skill].level).toBe(initialLevel);
      expect(updatedSkills[skill].skillPoints).toBeGreaterThan(initialSkills[skill].skillPoints);
    });
  });
});

function wait(sec): Promise<void> {
  return new Promise<void>((resolve) => {
    const inter = setInterval(() => {
      resolve();
      clearInterval(inter);
    }, sec * 1000);
  });
}
