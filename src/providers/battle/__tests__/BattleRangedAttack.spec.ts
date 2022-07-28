import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY, ItemSlotType } from "@rpg-engine/shared";
import { BattleRangedAttack } from "../BattleRangedAttack";
import { BattleAttackTarget } from "../BattleAttackTarget";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { BowsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { Types } from "mongoose";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";

describe("BattleRangedAttack.spec.ts", () => {
  let battleRangedAttack: BattleRangedAttack;
  let battleAttackTarget: BattleAttackTarget;

  let testNPC: INPC;
  let testCharacter: ICharacter;
  let characterEquipment: IEquipment;

  let hitTarget: any;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    battleRangedAttack = container.get<BattleRangedAttack>(BattleRangedAttack);
    battleAttackTarget = container.get<BattleAttackTarget>(BattleAttackTarget);
    hitTarget = jest.spyOn(battleAttackTarget, "hitTarget" as any);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testNPC = await unitTestHelper.createMockNPC(null, { hasSkills: true });
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });
    await testNPC.populate("skills").execPopulate();
    await testCharacter.populate("skills").execPopulate();

    // Equip testCharacter with a Bow
    characterEquipment = (await Equipment.findById(testCharacter.equipment).populate("inventory").exec()) as IEquipment;
    const bow = itemsBlueprintIndex[BowsBlueprint.Bow];
    const bowItem = new Item({ ...bow });
    const res = await bowItem.save();
    characterEquipment!.rightHand = res._id as Types.ObjectId | undefined;

    await characterEquipment!.save();

    testCharacter.attackType = EntityAttackType.Ranged;

    testCharacter.x = FromGridX(0);
    testCharacter.y = FromGridX(0);
    await testCharacter.save();

    testNPC.x = FromGridX(2);
    testNPC.y = FromGridX(2);
    await testNPC.save();
  });

  it("character does not have required ammo", async () => {
    const rangedAttackAmmo = await battleRangedAttack.getAmmoForRangedAttack(testCharacter);

    expect(rangedAttackAmmo).toEqual({});
  });

  it("character carries required ammo in accesory slot", async () => {
    const arrowId = await equipArrowInAccessorySlot(characterEquipment);

    const rangedAttackAmmo = await battleRangedAttack.getAmmoForRangedAttack(testCharacter);

    expect(rangedAttackAmmo).not.toEqual({});
    expect(rangedAttackAmmo.location).toEqual(ItemSlotType.Accessory);
    expect(rangedAttackAmmo.id).toEqual(arrowId);
    expect(rangedAttackAmmo.key).toEqual(BowsBlueprint.Arrow);
    expect(rangedAttackAmmo.maxRange).toBeGreaterThan(1);
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

  it("should hit a target if attacker has ranged attack type, required ammo and target is in range | ammo in accesory slot", async () => {
    await equipArrowInAccessorySlot(characterEquipment);
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    expect(hitTarget).toHaveBeenCalled();
  });

  it("should hit a target if attacker has ranged attack type, required ammo and target is in range | ammo in backpack slot", async () => {
    await equipArrowInBackpackSlot(characterEquipment);
    await battleAttackTarget.checkRangeAndAttack(testCharacter, testNPC);

    expect(hitTarget).toHaveBeenCalled();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

async function createArrow(): Promise<Types.ObjectId> {
  const arrow = itemsBlueprintIndex[BowsBlueprint.Arrow];
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
