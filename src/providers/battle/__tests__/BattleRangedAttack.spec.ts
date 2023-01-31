import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemFireStaff } from "@providers/item/data/blueprints/staffs/ItemFireStaff";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import {
  RangedWeaponsBlueprint,
  SpearsBlueprint,
  StaffsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { FromGridX, FromGridY, ItemSlotType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { Types } from "mongoose";
import { BattleAttackTarget } from "../BattleAttackTarget";
import { BattleRangedAttack } from "../BattleRangedAttack";

describe("BattleRangedAttack.spec.ts", () => {
  let battleRangedAttack: BattleRangedAttack;
  let battleAttackTarget: BattleAttackTarget;
  let testNPC: INPC;
  let testCharacter: ICharacter;
  let characterEquipment: IEquipment;
  let hitTarget: any;
  let bowItem: IItem;

  beforeAll(async () => {
    await unitTestHelper.initializeMapLoader();

    battleRangedAttack = container.get<BattleRangedAttack>(BattleRangedAttack);
    battleAttackTarget = container.get<BattleAttackTarget>(BattleAttackTarget);
    hitTarget = jest.spyOn(battleAttackTarget, "hitTarget" as any);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC(
      { attackType: EntityAttackType.Ranged, maxRangeAttack: 7 },
      { hasSkills: true }
    );

    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });

    await testNPC.populate("skills").execPopulate();
    await testCharacter.populate("skills").execPopulate();

    // Equip testCharacter with a Bow
    characterEquipment = (await Equipment.findById(testCharacter.equipment).populate("inventory").exec()) as IEquipment;
    const bow = itemsBlueprintIndex[RangedWeaponsBlueprint.Bow];
    bowItem = new Item({ ...bow });
    const res = await bowItem.save();
    characterEquipment!.rightHand = res._id as Types.ObjectId | undefined;

    await characterEquipment!.save();

    testCharacter.x = FromGridX(4);
    testCharacter.y = FromGridY(4);
    await testCharacter.save();

    testNPC.x = FromGridX(2);
    testNPC.y = FromGridY(2);
    await testNPC.save();
  });

  it("character does not have required ammo", async () => {
    // @ts-ignore
    const rangedAttackAmmo = await battleRangedAttack.getAmmoForRangedAttack(testCharacter, characterEquipment);

    expect(rangedAttackAmmo).toBeUndefined();
  });

  it("character carries required ammo in accesory slot", async () => {
    const arrowId = await equipAmmoInAccessorySlot(characterEquipment, RangedWeaponsBlueprint.Arrow);
    // @ts-ignore
    const rangedAttackAmmo = await battleRangedAttack.getAmmoForRangedAttack(testCharacter, characterEquipment);

    expect(rangedAttackAmmo).toBeDefined();
    expect(rangedAttackAmmo!.location).toEqual(ItemSlotType.Accessory);
    expect(rangedAttackAmmo!.id).toEqual(arrowId);
    expect(rangedAttackAmmo!.key).toEqual(RangedWeaponsBlueprint.Arrow);
    expect(rangedAttackAmmo!.maxRange).toBeGreaterThan(1);
  });

  it("ammo should be consumed | Accessory slot", async () => {
    const arrowId = await equipAmmoInAccessorySlot(characterEquipment, RangedWeaponsBlueprint.Arrow);

    await battleRangedAttack.consumeAmmo(
      {
        location: ItemSlotType.Accessory,
        id: arrowId,
        key: RangedWeaponsBlueprint.Arrow,
        maxRange: 2,
        equipment: characterEquipment,
      },
      testCharacter
    );

    expect(await Item.findById(arrowId)).toBeNull();
    expect(characterEquipment.accessory).toBeUndefined();
  });

  it("ammo should NOT be consumed | Inventory slot", async () => {
    const arrowId = await equipArrowInBackpackSlot(characterEquipment);

    try {
      await battleRangedAttack.consumeAmmo(
        {
          location: ItemSlotType.Inventory,
          id: arrowId,
          key: RangedWeaponsBlueprint.Arrow,
          maxRange: 2,
          equipment: characterEquipment,
        },
        testCharacter
      );
      throw new Error("This test should fail");
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toContain("Invalid ammo location");
    }
  });

  it("should NOT hit a target if attacker, attacker does not have enough ammo", async () => {
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    // expect hitTarget to not have been called
    expect(hitTarget).not.toHaveBeenCalled();
  });

  it("should NOT hit a target if attacker, target is out of range", async () => {
    await equipAmmoInAccessorySlot(characterEquipment, RangedWeaponsBlueprint.Arrow);

    const attacker = testCharacter;
    attacker.x = FromGridX(0);
    attacker.y = FromGridY(0);
    await attacker.save();

    const defender = testNPC;
    defender.x = FromGridX(10);
    defender.y = FromGridY(10);
    await defender.save();

    await battleAttackTarget.checkRangeAndAttack(attacker, defender);

    // expect hitTarget to not have been called

    expect(hitTarget).not.toHaveBeenCalled();
  });

  it("should NOT hit a target because a solid is in the way of the ranged attack", async () => {
    // There's a solid map tile in grid point (1,1)
    const attacker = testCharacter;
    attacker.x = FromGridX(0);
    attacker.y = FromGridY(0);
    await attacker.save();

    await equipArrowInBackpackSlot(characterEquipment);
    await battleAttackTarget.checkRangeAndAttack(attacker, testNPC);

    expect(hitTarget).not.toHaveBeenCalled();
  });

  it("should hit a target if attacker has ranged attack type, required ammo and target is in range | ammo in accesory slot", async () => {
    await equipAmmoInAccessorySlot(characterEquipment, RangedWeaponsBlueprint.Arrow);
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    expect(hitTarget).toHaveBeenCalled();
  });

  it("should hit NOT a target if attacker has ranged attack type, required ammo and target is in range | ammo in backpack slot", async () => {
    await equipArrowInBackpackSlot(characterEquipment);
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    expect(hitTarget).toBeCalledTimes(1);
  });

  it("should hit a target if attacker has ranged attack type and target is in range | Spear weapon", async () => {
    await equipAmmoInAccessorySlot(characterEquipment, RangedWeaponsBlueprint.Arrow);
    await equipWithSpear(characterEquipment);
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    expect(hitTarget).toBeCalledTimes(1);
  });

  it("should hit a target | NPC ranged attack ", async () => {
    await battleAttackTarget.checkRangeAndAttack(testNPC, testCharacter);
    expect(hitTarget).toBeCalledTimes(2);
  });

  it("should hit a target | NPC hybrid attack type", async () => {
    testNPC.attackType = EntityAttackType.MeleeRanged;
    await testNPC.save();

    // Ranged attack
    await battleAttackTarget.checkRangeAndAttack(testNPC, testCharacter);
    expect(hitTarget).toBeCalledTimes(3);

    // Melee attack (not passing maxRangeAttack field on purpose to check is doing melee attack)
    testNPC.maxRangeAttack = undefined;

    testNPC.x = FromGridX(4);
    testNPC.y = FromGridY(3);
    await testNPC.save();

    await battleAttackTarget.checkRangeAndAttack(testNPC, testCharacter);
    expect(hitTarget).toBeCalledTimes(4);
  });

  it("should hit a target, required ammo and target is in range | with multiple ammo keys", async () => {
    // Add stone ammo key to bow item
    // So now can use 2 types of ammo, arrows and stones
    bowItem.requiredAmmoKeys?.push(RangedWeaponsBlueprint.Stone);
    await bowItem.save();
    await equipAmmoInAccessorySlot(characterEquipment, RangedWeaponsBlueprint.Arrow);
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    expect(hitTarget).toBeCalledTimes(5);

    await equipAmmoInAccessorySlot(characterEquipment, RangedWeaponsBlueprint.Stone);
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    expect(hitTarget).toBeCalledTimes(6);
  });

  describe("magic staff ranged attack", () => {
    let staff: IItem;
    beforeEach(async () => {
      staff = await unitTestHelper.createMockItemFromBlueprint(StaffsBlueprint.FireStaff);
      characterEquipment!.rightHand = staff.id;

      await characterEquipment!.save();
    });

    it("special ammo dependant on mana availability", async () => {
      testCharacter.mana = Math.floor(itemFireStaff.attack! / 2) - 1;
      // @ts-ignore
      let rangedAttackAmmo = await battleRangedAttack.getAmmoForRangedAttack(testCharacter, characterEquipment);

      expect(rangedAttackAmmo).not.toBeDefined();

      testCharacter.mana = Math.ceil(itemFireStaff.attack! / 2) + 1;
      // @ts-ignore
      rangedAttackAmmo = await battleRangedAttack.getAmmoForRangedAttack(testCharacter, characterEquipment);

      expect(rangedAttackAmmo).toBeDefined();
      expect(rangedAttackAmmo!.location).toEqual(ItemSlotType.LeftHand);
      expect(rangedAttackAmmo!.id).toEqual(staff.id);
      expect(rangedAttackAmmo!.key).toEqual(itemFireStaff.projectileAnimationKey);
      expect(rangedAttackAmmo!.maxRange).toBe(itemFireStaff.maxRange);
    });

    it("mana should be consumed", async () => {
      const characterMana = testCharacter.mana;

      await equipAmmoInAccessorySlot(characterEquipment, RangedWeaponsBlueprint.Arrow);

      // @ts-ignore
      const rangedAttackAmmo = (await battleRangedAttack.getAmmoForRangedAttack(testCharacter, characterEquipment))!;
      // @ts-ignore
      await battleRangedAttack.consumeAmmo(rangedAttackAmmo, testCharacter);

      expect(await Item.findById(staff.id)).toBeDefined();
      expect(characterEquipment.accessory).toBeDefined();

      const updatedCharacter = (await Character.findById(testCharacter.id)) as unknown as ICharacter;
      expect(updatedCharacter.mana).toBe(characterMana - Math.ceil(itemFireStaff.attack! / 2));
    });
  });
});

async function createItem(itemKey: RangedWeaponsBlueprint): Promise<Types.ObjectId> {
  const itemData = itemsBlueprintIndex[itemKey];
  if (!itemData) {
    throw new Error(`Unsupported item key '${itemKey}'`);
  }
  const newItem = new Item({ ...itemData });
  const res = await newItem.save();
  return res._id;
}

async function equipAmmoInAccessorySlot(
  equipment: IEquipment,
  ammoKey: RangedWeaponsBlueprint
): Promise<Types.ObjectId> {
  const ammoId = await createItem(ammoKey);
  equipment!.accessory = ammoId;
  await equipment.save();
  return ammoId;
}

async function equipArrowInBackpackSlot(equipment: IEquipment): Promise<Types.ObjectId> {
  // Add items to character's backpack
  const backpack = equipment.inventory as unknown as IItem;
  const backpackContainer = await unitTestHelper.createMockBackpackItemContainer(backpack);
  backpack.itemContainer = backpackContainer._id;

  await Item.updateOne(
    {
      _id: backpack._id,
    },
    {
      $set: {
        itemContainer: backpackContainer._id,
      },
    }
  );
  const arrowId = await createItem(RangedWeaponsBlueprint.Arrow);
  const slotId = backpackContainer.firstAvailableSlotId;
  backpackContainer.slots[slotId!] = arrowId;

  backpackContainer.markModified("slots");
  await backpackContainer.save();
  return arrowId;
}

async function equipWithSpear(equipment: IEquipment): Promise<void> {
  const spear = itemsBlueprintIndex[SpearsBlueprint.Spear];
  const spearItem = new Item({ ...spear });
  const res = await spearItem.save();
  equipment.rightHand = res._id as Types.ObjectId | undefined;

  await equipment.save();
}
