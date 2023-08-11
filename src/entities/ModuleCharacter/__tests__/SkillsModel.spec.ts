import { container, unitTestHelper } from "@providers/inversify/container";
import { ArmorsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SkillStatsCalculator } from "@providers/skill/SkillsStatsCalculator";
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

    expect(attack).toBe(8.5);
    expect(defense).toBe(43.5);
  });
});
