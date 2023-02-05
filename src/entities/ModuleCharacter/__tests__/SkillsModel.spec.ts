import { IItem } from "@entities/ModuleInventory/ItemModel";
import { unitTestHelper } from "@providers/inversify/container";
import { ArmorsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ICharacter } from "../CharacterModel";
import { Equipment } from "../EquipmentModel";
import { Skill } from "../SkillsModel";

describe("SkillsModel", () => {
  let testCharacter: ICharacter;
  let testSword: IItem;
  let testGoldenArmor: IItem;

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasSkills: true,
      hasEquipment: true,
      hasInventory: true,
    });

    testSword = await unitTestHelper.createMockItem();
    testGoldenArmor = await unitTestHelper.createMockItemFromBlueprint(ArmorsBlueprint.GoldenArmor);
  });

  it("properly calculates attack and defense of a character", async () => {
    const equipments = await Equipment.find({});

    console.log(equipments);

    const equipment = await Equipment.findOne({
      owner: testCharacter._id,
    });

    if (!equipment) {
      throw new Error("Equipment not found");
    }

    equipment.leftHand = testSword;
    equipment.armor = testGoldenArmor;
    equipment.markModified("leftHand");
    equipment.markModified("armor");
    await equipment.save();

    const skills = await Skill.findById(testCharacter.skills);

    const attack = await skills?.attack;
    const defense = await skills?.defense;

    expect(attack).toBe(7);
    expect(defense).toBe(40);
  });
});
