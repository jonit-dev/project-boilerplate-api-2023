import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";

import { itemFireStaff } from "@providers/item/data/blueprints/staffs/item3/ItemFireStaff";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import {
  RangedWeaponsBlueprint,
  SpearsBlueprint,
  StaffsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { FromGridX, FromGridY, ItemSlotType } from "@rpg-engine/shared";
import { EntityAttackType, EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { Types } from "mongoose";
import { BattleAttackRanged } from "../BattleAttackRanged";
import { BattleAttackTarget } from "../BattleAttackTarget";
import { BattleAttackValidator } from "../BattleAttackValidator";

describe("BattleRangedAttack.spec.ts", () => {
  let battleRangedAttack: BattleAttackRanged;
  let battleAttackTarget: BattleAttackTarget;
  let battleAttackValidator: BattleAttackValidator;
  let testNPC: INPC;
  let testCharacter: ICharacter;
  let characterEquipment: IEquipment;
  let hitTarget: any;
  let bowItem: IItem;

  beforeAll(async () => {
    await unitTestHelper.initializeMapLoader();

    battleRangedAttack = container.get<BattleAttackRanged>(BattleAttackRanged);
    battleAttackTarget = container.get<BattleAttackTarget>(BattleAttackTarget);
    battleAttackValidator = container.get<BattleAttackValidator>(BattleAttackValidator);
    // @ts-ignore
    hitTarget = jest.spyOn(battleAttackTarget.hitTarget, "hit" as any);
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

  it("character carries reanged weapon in hand slot", async () => {
    const itemId = await equipAmmoInEquipmentSlot(characterEquipment, RangedWeaponsBlueprint.Shuriken, "rightHand", 1);
    // @ts-ignore
    const rangedAttackAmmo = await battleRangedAttack.getAmmoForRangedAttack(testCharacter, characterEquipment);

    expect(rangedAttackAmmo).toBeDefined();
    expect(rangedAttackAmmo!.location).toEqual(ItemSlotType.RightHand);
    expect(rangedAttackAmmo!.id).toEqual(itemId);
    expect(rangedAttackAmmo!.key).toEqual(RangedWeaponsBlueprint.Shuriken);
    expect(rangedAttackAmmo!.maxRange).toBeGreaterThan(1);
  });

  it("character carries required ammo in accesory slot", async () => {
    const arrowId = await equipAmmoInEquipmentSlot(characterEquipment, RangedWeaponsBlueprint.Arrow, "accessory", 1);
    // @ts-ignore
    const rangedAttackAmmo = await battleRangedAttack.getAmmoForRangedAttack(testCharacter, characterEquipment);

    expect(rangedAttackAmmo).toBeDefined();
    expect(rangedAttackAmmo!.location).toEqual(ItemSlotType.Accessory);
    expect(rangedAttackAmmo!.id).toEqual(arrowId);
    expect(rangedAttackAmmo!.key).toEqual(RangedWeaponsBlueprint.Arrow);
    expect(rangedAttackAmmo!.maxRange).toBeGreaterThan(1);
  });

  it("all ammo should be consumed | Hand slot", async () => {
    const itemId = await equipAmmoInEquipmentSlot(characterEquipment, RangedWeaponsBlueprint.Shuriken, "rightHand", 1);
    await battleRangedAttack.consumeAmmo(
      {
        location: ItemSlotType.RightHand,
        id: itemId,
        key: RangedWeaponsBlueprint.Shuriken,
        maxRange: 7,
        equipment: characterEquipment,
      },
      testCharacter
    );

    const updatedEquipment = await Equipment.findById(characterEquipment.id);
    expect(await Item.findById(itemId)).toBeNull();
    expect(updatedEquipment).toBeDefined();
    expect(updatedEquipment!.rightHand).toBeUndefined();
  });

  it("some ammo should be consumed & should update stackQty | Hand slot", async () => {
    const initialQty = 10;
    const consumedCount = 5;
    const itemId = await equipAmmoInEquipmentSlot(
      characterEquipment,
      RangedWeaponsBlueprint.Shuriken,
      "rightHand",
      initialQty
    );

    for (let i = 0; i < consumedCount; i++) {
      await battleRangedAttack.consumeAmmo(
        {
          location: ItemSlotType.RightHand,
          id: itemId,
          key: RangedWeaponsBlueprint.Shuriken,
          maxRange: 7,
          equipment: characterEquipment,
        },
        testCharacter
      );
    }

    const updatedEquipment = await Equipment.findById(characterEquipment.id);
    const updatedItem = await Item.findById(itemId);
    expect(updatedItem).toBeDefined();
    expect(updatedItem?.stackQty).toEqual(initialQty - consumedCount);
    expect(updatedEquipment).toBeDefined();
    expect(updatedEquipment!.rightHand).toBeDefined();
  });

  it("ammo should be consumed | Accessory slot", async () => {
    const arrowId = await equipAmmoInEquipmentSlot(characterEquipment, RangedWeaponsBlueprint.Arrow, "accessory", 1);

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

    const updatedEquipment = await Equipment.findById(characterEquipment.id);
    expect(await Item.findById(arrowId)).toBeNull();
    expect(updatedEquipment).toBeDefined();
    expect(updatedEquipment!.accessory).toBeUndefined();
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
    await equipAmmoInEquipmentSlot(characterEquipment, RangedWeaponsBlueprint.Arrow, "accessory", 1);

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

  it("should hit a target if attacker has ranged attack type, required ammo and target is in range | ammo in right hand slot", async () => {
    await equipAmmoInEquipmentSlot(characterEquipment, RangedWeaponsBlueprint.Shuriken, "rightHand", 1);
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    expect(hitTarget).toHaveBeenCalled();
  });

  it("should hit a target if attacker has ranged attack type, required ammo and target is in range | ammo in accesory slot", async () => {
    await equipAmmoInEquipmentSlot(characterEquipment, RangedWeaponsBlueprint.Arrow, "accessory", 1);
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    expect(hitTarget).toBeCalledTimes(2);
  });

  it("should hit NOT a target if attacker has ranged attack type, required ammo and target is in range | ammo in backpack slot", async () => {
    await equipArrowInBackpackSlot(characterEquipment);
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    expect(hitTarget).toBeCalledTimes(2);
  });

  it("should hit a target if attacker has ranged attack type and target is in range | Spear weapon", async () => {
    await equipAmmoInEquipmentSlot(characterEquipment, RangedWeaponsBlueprint.Arrow, "accessory", 1);
    await equipWithSpear(characterEquipment);
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    expect(hitTarget).toBeCalledTimes(2);
  });

  it("should hit a target | NPC ranged attack ", async () => {
    await battleAttackTarget.checkRangeAndAttack(testNPC, testCharacter);
    expect(hitTarget).toBeCalledTimes(3);
  });

  it("should hit a target | NPC hybrid attack type", async () => {
    testNPC.attackType = EntityAttackType.MeleeRanged;
    await testNPC.save();

    // Ranged attack
    await battleAttackTarget.checkRangeAndAttack(testNPC, testCharacter);
    expect(hitTarget).toBeCalledTimes(4);

    // Melee attack (not passing maxRangeAttack field on purpose to check is doing melee attack)
    testNPC.maxRangeAttack = undefined;

    testNPC.x = FromGridX(4);
    testNPC.y = FromGridY(3);
    await testNPC.save();

    await battleAttackTarget.checkRangeAndAttack(testNPC, testCharacter);
    expect(hitTarget).toBeCalledTimes(5);
  });

  it("should hit a target, required ammo and target is in range | with multiple ammo keys", async () => {
    // Add stone ammo key to bow item
    // So now can use 2 types of ammo, arrows and stones
    bowItem.requiredAmmoKeys?.push(RangedWeaponsBlueprint.Stone);
    await bowItem.save();
    await equipAmmoInEquipmentSlot(characterEquipment, RangedWeaponsBlueprint.Arrow, "accessory", 1);
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    expect(hitTarget).toBeCalledTimes(6);

    await equipAmmoInEquipmentSlot(characterEquipment, RangedWeaponsBlueprint.Stone, "accessory", 1);
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    expect(hitTarget).toBeCalledTimes(7);
  });

  describe("magic staff ranged attack", () => {
    let staff: IItem;
    beforeEach(async () => {
      staff = await unitTestHelper.createMockItemFromBlueprint(StaffsBlueprint.FireStaff);
      characterEquipment!.rightHand = staff.id;

      await characterEquipment!.save();
    });

    it("special ammo dependant on mana availability", async () => {
      testCharacter.mana = Math.floor(itemFireStaff.attack! / 6) - 1;
      // @ts-ignore
      const validadeMagicAttack = await battleAttackValidator.validateMagicAttack(testCharacter._id, {
        targetId: testNPC._id,
        targetType: testNPC.type as EntityType,
      });
      expect(validadeMagicAttack).toBeTruthy();

      testCharacter.mana = Math.ceil(itemFireStaff.attack! / 6) + 1;
      // @ts-ignore
      const rangedAttackAmmo = await battleRangedAttack.getAmmoForRangedAttack(testCharacter, characterEquipment);

      expect(rangedAttackAmmo).toBeDefined();
      expect(rangedAttackAmmo!.location).toEqual(ItemSlotType.RightHand);
      expect(rangedAttackAmmo!.id.toString()).toEqual(staff.id);
      expect(rangedAttackAmmo!.key).toEqual(itemFireStaff.projectileAnimationKey);
      expect(rangedAttackAmmo!.maxRange).toBe(itemFireStaff.maxRange);
    });

    it("mana should be consumed", async () => {
      await equipAmmoInEquipmentSlot(characterEquipment, RangedWeaponsBlueprint.Arrow, "accessory", 1);

      // @ts-ignore
      const rangedAttackAmmo = (await battleRangedAttack.getAmmoForRangedAttack(testCharacter, characterEquipment))!;
      // @ts-ignore
      await battleRangedAttack.consumeMana(rangedAttackAmmo, testCharacter._id, {
        targetId: testNPC._id,
        targetType: testNPC.type as EntityType,
      });

      expect(await Item.findById(staff.id)).toBeDefined();
      expect(characterEquipment.accessory).toBeDefined();

      const updatedCharacter = (await Character.findById(testCharacter.id)) as unknown as ICharacter;
      expect(updatedCharacter.mana).toBe(96);
    });
  });
});

async function createItem(itemKey: RangedWeaponsBlueprint, qty?: number): Promise<Types.ObjectId> {
  const itemData = itemsBlueprintIndex[itemKey];
  if (!itemData) {
    throw new Error(`Unsupported item key '${itemKey}'`);
  }
  const newItem = new Item({ ...itemData });
  if (qty && newItem.maxStackSize) {
    newItem.stackQty = qty;
  }
  const res = await newItem.save();
  return res._id;
}

async function equipAmmoInEquipmentSlot(
  equipment: IEquipment,
  ammoKey: RangedWeaponsBlueprint,
  equipmentSlot: string,
  qty?: number
): Promise<Types.ObjectId> {
  const ammoId = await createItem(ammoKey, qty);
  equipment![equipmentSlot] = ammoId;
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
