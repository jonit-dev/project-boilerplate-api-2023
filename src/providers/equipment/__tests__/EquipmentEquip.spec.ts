import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ItemSubType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { EquipmentEquip } from "../EquipmentEquip";

describe("EquipmentEquip.spec.ts", () => {
  let testCharacter: ICharacter;
  let equipmentEquip: EquipmentEquip;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;
  let bowItem: IItem;
  let swordItem: IItem;
  let shieldItem: IItem;
  let sendEventToUser;

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    bowItem = await unitTestHelper.createItemBow();
    swordItem = await unitTestHelper.createMockItem();
    shieldItem = await unitTestHelper.createMockShield();

    equipmentEquip = container.get<EquipmentEquip>(EquipmentEquip);

    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    // @ts-ignore
    sendEventToUser = jest.spyOn(equipmentEquip.socketMessaging, "sendEventToUser");
  });

  it("should properly equip an item", async () => {
    inventoryContainer.slots[0] = swordItem;
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    const equip = await equipmentEquip.equip(testCharacter, swordItem._id, inventoryContainer.id);

    expect(equip).toBeTruthy();

    // make sure item is on the slot and update event was called
    expect(sendEventToUser).toHaveBeenCalled();

    // make sure item was delete on the inventory

    const updatedInventory = await ItemContainer.findById(inventory.itemContainer);
    expect(updatedInventory?.slots[0]).toBeNull();
  });

  describe("Validation", () => {
    it("should fail if the character does not have the item on the inventory (inventory source)", async () => {
      const equip = await equipmentEquip.equip(testCharacter, swordItem._id, inventoryContainer.id);

      expect(equip).toBeFalsy();
    });
  });

  describe("AttackType", () => {
    it("should successfully update the attack type, after equipping an item | Melee", async () => {
      inventoryContainer.slots[0] = swordItem;
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      const equip = await equipmentEquip.equip(testCharacter, swordItem._id, inventoryContainer.id);

      expect(equip).toBeTruthy();

      const characterAttackType = await Character.findById({ _id: testCharacter._id });

      expect(await characterAttackType?.attackType).toEqual(EntityAttackType.Melee);
    });

    it("should successfully update the attack type, after equipping an item | Ranged", async () => {
      const characterAttackTypeBeforeEquip = await Character.findById({ _id: testCharacter._id });

      expect(EntityAttackType.Melee).toEqual(await characterAttackTypeBeforeEquip?.attackType);

      inventoryContainer.slots[0] = bowItem;
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      const equip = await equipmentEquip.equip(testCharacter, bowItem._id, inventoryContainer.id);

      expect(equip).toBeTruthy();

      const characterAttackTypeAfterEquip = await Character.findById({ _id: testCharacter._id });

      expect(await characterAttackTypeAfterEquip?.attackType).toEqual(EntityAttackType.Ranged);
    });

    it("should successfully update the attack type, after equipping an item | Sword/Sword", async () => {
      inventoryContainer.slots[1] = swordItem;
      inventoryContainer.slots[0] = swordItem;
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      const characterAttackTypeBeforeEquip = await Character.findById({ _id: testCharacter._id });

      expect(EntityAttackType.Melee).toEqual(await characterAttackTypeBeforeEquip?.attackType);

      const equipSword = await equipmentEquip.equip(testCharacter, swordItem._id, inventoryContainer.id);

      expect(inventoryContainer.slots[0].rangeType).toEqual(EntityAttackType.Melee);
      expect(inventoryContainer.slots[1].rangeType).toEqual(EntityAttackType.Melee);
      expect(equipSword).toBeTruthy();

      const characterAttackTypeAfterEquip = await Character.findById({ _id: testCharacter._id });

      expect(await characterAttackTypeAfterEquip?.attackType).toEqual(EntityAttackType.Melee);
    });

    it("should successfully update the attack type, after equipping an item | Sword and Shield", async () => {
      inventoryContainer.slots[1] = shieldItem;
      inventoryContainer.slots[0] = swordItem;
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      const characterAttackTypeBeforeEquip = await Character.findById({ _id: testCharacter._id });

      expect(await characterAttackTypeBeforeEquip?.attackType).toEqual(EntityAttackType.Melee);

      const equipShield = await equipmentEquip.equip(testCharacter, shieldItem._id, inventoryContainer.id);
      const equipSword = await equipmentEquip.equip(testCharacter, swordItem._id, inventoryContainer.id);

      expect(equipSword).toBeTruthy();
      expect(equipShield).toBeTruthy();

      const characterAttackTypeAfterEquip = await Character.findById({ _id: testCharacter._id });

      expect(await characterAttackTypeAfterEquip?.attackType).toEqual(EntityAttackType.Melee);
    });

    it("should successfully update the attack type, after equipping an item | Shield/Shield", async () => {
      inventoryContainer.slots[0] = shieldItem;
      inventoryContainer.slots[1] = shieldItem;
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      const equipShield = await equipmentEquip.equip(testCharacter, shieldItem._id, inventoryContainer.id);

      expect(inventoryContainer.slots[0].subType).toEqual(ItemSubType.Shield);
      expect(inventoryContainer.slots[1].subType).toEqual(ItemSubType.Shield);
      expect(equipShield).toBeTruthy();

      const characterAttackTypeAfterEquip = await Character.findById({ _id: testCharacter._id });

      expect(await characterAttackTypeAfterEquip?.attackType).toEqual(EntityAttackType.Melee);
    });

    it("should have attack type of Melee when unarmed | Unarmed[Melee] ", async () => {
      const characterAttackType = await Character.findById({ _id: testCharacter._id });

      expect(await characterAttackType?.attackType).toEqual(EntityAttackType.Melee);
      expect(await characterAttackType?.weapon).toBeUndefined();
    });
  });
});
