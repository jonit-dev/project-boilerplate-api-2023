import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ArmorsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SkillStatsCalculator } from "@providers/skill/SkillsStatsCalculator";
import { BasicAttribute, CharacterBuffDurationType, CharacterBuffType } from "@rpg-engine/shared";
import { ICharacter } from "../CharacterModel";
import { Equipment } from "../EquipmentModel";
import { Skill } from "../SkillsModel";

describe("SkillsModel", () => {
  let skillStatsCalculator;

  beforeAll(() => {
    skillStatsCalculator = container.get(SkillStatsCalculator);
  });

  it("properly calculates attack and defense of a character", async () => {
    const testCharacter = (await unitTestHelper.createMockCharacter(null, {
      hasSkills: true,
      hasEquipment: true,
      hasInventory: true,
    })) as ICharacter;

    const equipment = await Equipment.findOne({
      owner: testCharacter._id,
    });

    if (!equipment) {
      throw new Error("Equipment not found");
    }

    const testSword = await unitTestHelper.createMockItem();
    const testGoldenArmor = await unitTestHelper.createMockItemFromBlueprint(ArmorsBlueprint.GoldenArmor);

    equipment.leftHand = testSword;
    equipment.armor = testGoldenArmor;
    equipment.markModified("leftHand");
    equipment.markModified("armor");
    await equipment.save();

    const skills = await Skill.findById(testCharacter.skills);

    const attack = await skillStatsCalculator.getAttack(skills);
    const defense = await skillStatsCalculator.getDefense(skills);

    expect(attack).toBe(7);
    expect(defense).toBe(40);
  });

  describe("findByIdWithBuffs", () => {
    let characterBuffActivator: CharacterBuffActivator;
    let testCharacter: ICharacter;

    beforeAll(() => {
      characterBuffActivator = container.get(CharacterBuffActivator);
    });

    beforeEach(async () => {
      testCharacter = (await unitTestHelper.createMockCharacter(null, { hasSkills: true })) as ICharacter;
    });

    it("should return skill with buffs", async () => {
      await characterBuffActivator.enablePermanentBuff(testCharacter, {
        type: CharacterBuffType.Skill,
        trait: BasicAttribute.Magic,
        buffPercentage: 10,
        durationType: CharacterBuffDurationType.Permanent,
      });

      const skills = await Skill.findByIdWithBuffs(testCharacter.skills);

      expect(skills.magic.level).toBe(1.1);
    });
  });
});
