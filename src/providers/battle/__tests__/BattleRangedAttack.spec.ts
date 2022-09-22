import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { RangedBlueprint, SpearsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
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

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    await unitTestHelper.initializeMapLoader();

    battleRangedAttack = container.get<BattleRangedAttack>(BattleRangedAttack);
    battleAttackTarget = container.get<BattleAttackTarget>(BattleAttackTarget);
    hitTarget = jest.spyOn(battleAttackTarget, "hitTarget" as any);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

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
    const bow = itemsBlueprintIndex[RangedBlueprint.Bow];
    const bowItem = new Item({ ...bow });
    const res = await bowItem.save();
    characterEquipment!.rightHand = res._id as Types.ObjectId | undefined;

    await characterEquipment!.save();

    testCharacter.attackType = EntityAttackType.Ranged;

    testCharacter.x = FromGridX(4);
    testCharacter.y = FromGridY(4);
    await testCharacter.save();

    testNPC.x = FromGridX(2);
    testNPC.y = FromGridY(2);
    await testNPC.save();
  });

  it("character does not have required ammo", async () => {
    // @ts-ignore
    const rangedAttackAmmo = await battleRangedAttack.getAmmoForRangedAttack(
      await testCharacter.weapon,
      characterEquipment
    );

    expect(rangedAttackAmmo).toBeUndefined();
  });

  it("character carries required ammo in accesory slot", async () => {
    const arrowId = await equipArrowInAccessorySlot(characterEquipment);
    // @ts-ignore
    const rangedAttackAmmo = await battleRangedAttack.getAmmoForRangedAttack(
      await testCharacter.weapon,
      characterEquipment
    );

    expect(rangedAttackAmmo).toBeDefined();
    expect(rangedAttackAmmo!.location).toEqual(ItemSlotType.Accessory);
    expect(rangedAttackAmmo!.id).toEqual(arrowId);
    expect(rangedAttackAmmo!.key).toEqual(RangedBlueprint.Arrow);
    expect(rangedAttackAmmo!.maxRange).toBeGreaterThan(1);
  });

  it("ammo should be consumed | Accessory slot", async () => {
    const arrowId = await equipArrowInAccessorySlot(characterEquipment);

    await battleRangedAttack.consumeAmmo(
      {
        location: ItemSlotType.Accessory,
        id: arrowId,
        key: RangedBlueprint.Arrow,
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
          key: RangedBlueprint.Arrow,
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
    await equipArrowInAccessorySlot(characterEquipment);

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
    await equipArrowInAccessorySlot(characterEquipment);
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    expect(hitTarget).toHaveBeenCalled();
  });

  it("should hit NOT a target if attacker has ranged attack type, required ammo and target is in range | ammo in backpack slot", async () => {
    await equipArrowInBackpackSlot(characterEquipment);
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    expect(hitTarget).toBeCalledTimes(1);
  });

  it("should hit a target if attacker has ranged attack type and target is in range | Spear weapon", async () => {
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

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

async function createArrow(): Promise<Types.ObjectId> {
  const arrow = itemsBlueprintIndex[RangedBlueprint.Arrow];
  const arrowItem = new Item({ ...arrow });
  const res = await arrowItem.save();
  return res._id;
}

async function equipArrowInAccessorySlot(equipment: IEquipment): Promise<Types.ObjectId> {
  const arrowId = await createArrow();
  equipment!.accessory = arrowId;
  await equipment.save();
  return arrowId;
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
  const arrowId = await createArrow();

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
