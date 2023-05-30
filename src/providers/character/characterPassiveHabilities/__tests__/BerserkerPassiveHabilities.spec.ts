import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { AxesBlueprint, DaggersBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CharacterClass } from "@rpg-engine/shared";
import { BerserkerPassiveHabilities } from "../BerserkerPassiveHabilities";

describe("BerserkerPassiveHabilities", () => {
  let berserkerPassiveHabilities: BerserkerPassiveHabilities;
  let testCharacter: ICharacter;
  let equipment: IEquipment;
  beforeAll(() => {
    berserkerPassiveHabilities = container.get(BerserkerPassiveHabilities);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true });

    testCharacter.class = CharacterClass.Berserker;
    await testCharacter.save();

    equipment = (await Equipment.findById(testCharacter.equipment)) as IEquipment;
  });

  it("should equip 2x one handed swords", async () => {
    const sword1 = await unitTestHelper.createMockItemFromBlueprint(SwordsBlueprint.Sword);
    const sword2 = await unitTestHelper.createMockItemFromBlueprint(SwordsBlueprint.Sword);

    equipment.leftHand = sword1._id;
    await equipment.save();

    const canEquip = await berserkerPassiveHabilities.canBerserkerEquipItem(testCharacter._id, sword2._id);

    expect(canEquip).toBe(true);
  });
  it("should equip 2x one handed axes", async () => {
    const axe1 = await unitTestHelper.createMockItemFromBlueprint(AxesBlueprint.Axe);
    const axe2 = await unitTestHelper.createMockItemFromBlueprint(AxesBlueprint.Axe);

    equipment.leftHand = axe1._id;
    await equipment.save();

    const canEquip = await berserkerPassiveHabilities.canBerserkerEquipItem(testCharacter._id, axe2._id);

    expect(canEquip).toBe(true);
  });

  it("should not equip 2 one-handed weapons", async () => {
    const sword = await unitTestHelper.createMockItemFromBlueprint(SwordsBlueprint.Sword);
    const dagger = await unitTestHelper.createMockItemFromBlueprint(DaggersBlueprint.Dagger);

    equipment.leftHand = sword._id;
    await equipment.save();

    const canEquip = await berserkerPassiveHabilities.canBerserkerEquipItem(testCharacter._id, dagger._id);

    expect(canEquip).toBe(false);
  });

  it("should not equip two-handed sword if one-handed weapon is already equipped", async () => {
    const sword1 = await unitTestHelper.createMockItemFromBlueprint(SwordsBlueprint.Sword);
    const twoHandedSword = await unitTestHelper.createMockItemFromBlueprint(SwordsBlueprint.Sword, {
      isTwoHanded: true,
    });

    equipment.leftHand = sword1._id;
    await equipment.save();

    const canEquip = await berserkerPassiveHabilities.canBerserkerEquipItem(testCharacter._id, twoHandedSword._id);
    expect(canEquip).toBe(false);
  });

  it("should not equip two-handed axe if one-handed weapon is already equipped", async () => {
    const axe1 = await unitTestHelper.createMockItemFromBlueprint(AxesBlueprint.Axe);
    const twoHandedAxe = await unitTestHelper.createMockItemFromBlueprint(AxesBlueprint.Axe, { isTwoHanded: true });

    equipment.leftHand = axe1._id;
    await equipment.save();

    const canEquip = await berserkerPassiveHabilities.canBerserkerEquipItem(testCharacter._id, twoHandedAxe._id);
    expect(canEquip).toBe(false);
  });

  it("should not equip a dagger if a sword is already equipped", async () => {
    const sword = await unitTestHelper.createMockItemFromBlueprint(SwordsBlueprint.Sword);
    const dagger = await unitTestHelper.createMockItemFromBlueprint(DaggersBlueprint.Dagger);

    equipment.leftHand = sword._id;
    await equipment.save();

    const canEquip = await berserkerPassiveHabilities.canBerserkerEquipItem(testCharacter._id, dagger._id);

    expect(canEquip).toBe(false);
  });
});
