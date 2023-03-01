import { container, unitTestHelper } from "@providers/inversify/container";

import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import {
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { EntityAttackType } from "@rpg-engine/shared";
import { CharacterWeapon } from "../CharacterWeapon";

describe("CharacterWeapon.spec.ts", () => {
  let characterWeapon: CharacterWeapon;
  let testCharacter: ICharacter;

  beforeAll(() => {
    characterWeapon = container.get<CharacterWeapon>(CharacterWeapon);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true });

    const testSword = await unitTestHelper.createMockItemFromBlueprint(SwordsBlueprint.ShortSword);
    const testShield = await unitTestHelper.createMockItemFromBlueprint(ShieldsBlueprint.WoodenShield);

    const equipment = await Equipment.findById(testCharacter.equipment);

    if (!equipment) {
      throw new Error("Equipment not found");
    }

    equipment.leftHand = testSword._id;
    equipment.rightHand = testShield._id;

    await equipment.save();
  });

  it("should return the correct weapon", async () => {
    const weapon = await characterWeapon.getWeapon(testCharacter);

    if (!weapon) throw new Error("Weapon not found");

    expect(weapon.key).toBe(SwordsBlueprint.ShortSword);
  });

  it("should return hasShield as true, if it has a shield", async () => {
    const hasShield = await characterWeapon.hasShield(testCharacter);

    expect(hasShield).toBeTruthy();
  });

  it("should return the proper attack type - MELEE", async () => {
    const attackType = await characterWeapon.getAttackType(testCharacter);

    expect(attackType).toBe(EntityAttackType.Melee);
  });
  it("should return the proper attack type - RANGED", async () => {
    const testBow = await unitTestHelper.createMockItemFromBlueprint(RangedWeaponsBlueprint.Bow);

    const equipment = await Equipment.findById(testCharacter.equipment);

    if (!equipment) {
      throw new Error("Equipment not found");
    }

    equipment.leftHand = testBow._id;
    equipment.rightHand = undefined;

    await equipment.save();

    const attackType = await characterWeapon.getAttackType(testCharacter);

    expect(attackType).toBe(EntityAttackType.Ranged);
  });
});
