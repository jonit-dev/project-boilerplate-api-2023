import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterWeapon } from "@providers/character/CharacterWeapon";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data";
import { DaggersBlueprint, SpearsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CharacterClass, CombatSkill, ISkill, ItemSubType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { EquipmentEquip } from "../EquipmentEquip";
import { EquipmentStatsCalculator } from "../EquipmentStatsCalculator";

describe("EquipmentEquip.spec.ts", () => {
  let testCharacter: ICharacter;
  let equipmentEquip: EquipmentEquip;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;
  let bowItem: IItem;
  let swordItem: IItem;
  let swordItem2: IItem;
  let daggerItem: IItem;
  let daggerItem2: IItem;
  let shieldItem: IItem;
  let spearItem: IItem;
  let spearItem2: IItem;
  let testItem: IItem;
  let sendEventToUser;
  let equipmentStatsCalculator: EquipmentStatsCalculator;
  let characterWeapon: CharacterWeapon;
  let sendErrorMessageToCharacter;
  let isItemAllowed;

  beforeAll(() => {
    equipmentStatsCalculator = container.get<EquipmentStatsCalculator>(EquipmentStatsCalculator);
    characterWeapon = container.get<CharacterWeapon>(CharacterWeapon);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });

    testCharacter.class = "Berserker";
    // create Mock item will require level 1 and dagger skill level 1
    bowItem = await unitTestHelper.createItemBow();
    swordItem = await unitTestHelper.createMockItem();
    swordItem2 = await unitTestHelper.createMockItem();
    daggerItem = await unitTestHelper.createMockItemFromBlueprint(DaggersBlueprint.AzureDagger);
    daggerItem2 = await unitTestHelper.createMockItemFromBlueprint(DaggersBlueprint.AzureDagger);
    shieldItem = await unitTestHelper.createMockShield();
    spearItem = await unitTestHelper.createMockItemFromBlueprint(SpearsBlueprint.Spear);
    spearItem2 = await unitTestHelper.createMockItemFromBlueprint(SpearsBlueprint.Spear);
    testItem = await unitTestHelper.createMockItem();

    equipmentEquip = container.get<EquipmentEquip>(EquipmentEquip);

    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    // @ts-ignore
    sendEventToUser = jest.spyOn(equipmentEquip.socketMessaging, "sendEventToUser");

    // @ts-ignore
    sendErrorMessageToCharacter = jest.spyOn(equipmentEquip.socketMessaging, "sendErrorMessageToCharacter");

    // @ts-ignore
    isItemAllowed = jest.spyOn(equipmentEquip.equipmentCharacterClass, "isItemAllowed");
  });

  it("should properly equip an item with minimum skill requirements", async () => {
    // create Mock item will require level 1 and dagger skill level 1
    inventoryContainer.slots[0] = swordItem;
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    // berserker can equip swords
    const berserker = (await Character.findByIdAndUpdate(
      testCharacter._id,
      {
        class: CharacterClass.Berserker,
      },
      { new: true }
    )) as ICharacter;

    const equip = await equipmentEquip.equip(berserker, swordItem._id, inventoryContainer.id);

    expect(equip).toBeTruthy();

    // make sure item is on the slot and update event was called
    expect(sendEventToUser).toHaveBeenCalled();

    // make sure item was delete on the inventory

    const updatedInventory = await ItemContainer.findById(inventory.itemContainer);
    expect(updatedInventory?.slots[0]).toBeNull();
  });

  it("should properly equip 2 sword Class Berserker", async () => {
    inventoryContainer.slots[0] = swordItem;
    inventoryContainer.slots[1] = swordItem2;
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    const berserker = (await Character.findByIdAndUpdate(
      testCharacter._id,
      {
        class: CharacterClass.Berserker,
      },
      { new: true }
    )) as ICharacter;

    const equipOneHand = await equipmentEquip.equip(berserker, swordItem._id, inventoryContainer.id);
    const equipAnotherHand = await equipmentEquip.equip(berserker, swordItem2._id, inventoryContainer.id);

    expect(equipOneHand).toBeTruthy();
    expect(equipAnotherHand).toBeTruthy();

    expect(sendEventToUser).toHaveBeenCalled();

    const updatedInventory = await ItemContainer.findById(inventory.itemContainer);
    expect(updatedInventory?.slots[0]).toBeNull();
    expect(updatedInventory?.slots[1]).toBeNull();
  });

  it("should properly equip 2 dagger Class Rogue", async () => {
    inventoryContainer.slots[0] = daggerItem;
    inventoryContainer.slots[1] = daggerItem2;
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    const rogue = (await Character.findByIdAndUpdate(
      testCharacter._id,
      {
        class: CharacterClass.Rogue,
      },
      { new: true }
    )) as ICharacter;

    // add dagger skills to character
    const skill = (await Skill.findById(rogue.skills).lean()) as ISkill;
    skill.level = 10;
    skill.dagger.level = 10;
    (await Skill.findByIdAndUpdate(skill._id, { ...skill }).lean()) as ISkill;

    const equipOneHand = await equipmentEquip.equip(rogue, daggerItem._id, inventoryContainer.id);
    const equipAnotherHand = await equipmentEquip.equip(rogue, daggerItem2._id, inventoryContainer.id);

    expect(equipOneHand).toBeTruthy();
    expect(equipAnotherHand).toBeTruthy();

    expect(sendEventToUser).toHaveBeenCalled();

    const updatedInventory = await ItemContainer.findById(inventory.itemContainer);
    expect(updatedInventory?.slots[0]).toBeNull();
    expect(updatedInventory?.slots[1]).toBeNull();
  });

  it("should fail equip 2 sword Class Warrior", async () => {
    inventoryContainer.slots[0] = swordItem;
    inventoryContainer.slots[1] = swordItem2;
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    const warrior = (await Character.findByIdAndUpdate(
      testCharacter._id,
      {
        class: CharacterClass.Warrior,
      },
      { new: true }
    )) as ICharacter;

    const equipOneHand = await equipmentEquip.equip(warrior, swordItem._id, inventoryContainer.id);
    const equipAnotherHand = await equipmentEquip.equip(warrior, swordItem2._id, inventoryContainer.id);

    expect(equipOneHand).toBeTruthy();
    expect(equipAnotherHand).toBeFalsy();

    expect(sendEventToUser).toHaveBeenCalled();

    const updatedInventory = await ItemContainer.findById(inventory.itemContainer);
    expect(updatedInventory?.slots[0]).toBeNull();
    expect(updatedInventory?.slots[1]._id).toEqual(swordItem2._id);
  });

  it("should fail equip 2 spear Class Hunter", async () => {
    inventoryContainer.slots[0] = spearItem;
    inventoryContainer.slots[1] = spearItem2;
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    const hunter = (await Character.findByIdAndUpdate(
      testCharacter._id,
      {
        class: CharacterClass.Hunter,
      },
      { new: true }
    )) as ICharacter;

    const equipOneHand = await equipmentEquip.equip(hunter, spearItem._id, inventoryContainer.id);
    const equipAnotherHand = await equipmentEquip.equip(hunter, spearItem2._id, inventoryContainer.id);

    expect(equipOneHand).toBeTruthy();
    expect(equipAnotherHand).toBeFalsy();

    expect(sendEventToUser).toHaveBeenCalled();

    const updatedInventory = await ItemContainer.findById(inventory.itemContainer);
    expect(updatedInventory?.slots[0]).toBeNull();
    expect(updatedInventory?.slots[1]._id).toEqual(spearItem2._id);
  });

  describe("Min level and skill requirements", () => {
    let minRequiredLevelSkillDagger: IItem; // a dagger with minimum level and skill requirements

    beforeEach(async () => {
      const minReqLevelDaggerBlueprint = itemsBlueprintIndex[DaggersBlueprint.AzureDagger];

      minReqLevelDaggerBlueprint.minRequirements = {
        level: 5,
        skill: {
          name: CombatSkill.Dagger,
          level: 7,
        },
      };

      minRequiredLevelSkillDagger = await unitTestHelper.createMockItemFromBlueprint(DaggersBlueprint.AzureDagger, {
        ...minReqLevelDaggerBlueprint,
      });
    });

    it("should not equip an item without minimum level and without minimum skill level", async () => {
      // this dagger should require a minimum level of 5 and a minimum skill level of 7

      inventoryContainer.slots[0] = minRequiredLevelSkillDagger;
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      const equip = await equipmentEquip.equip(testCharacter, minRequiredLevelSkillDagger._id, inventoryContainer.id);

      expect(equip).toBeFalsy();

      // make sure error message send to the character
      expect(sendErrorMessageToCharacter).toHaveBeenCalled();

      // make sure item was not delete on the inventory
      const updatedInventory = await ItemContainer.findById(inventory.itemContainer);
      expect(updatedInventory?.slots[0]).not.toBeNull();
    });

    it("should not equip an item without minimum level but with minimum skill level", async () => {
      // this dagger should require a minimum level of 5 and a minimum skill level of 7
      inventoryContainer.slots[0] = minRequiredLevelSkillDagger;
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      // add dagger skills to character, level is 1 and skill level is 10
      const skill = (await Skill.findById(testCharacter.skills).lean()) as ISkill;
      skill.level = 1;
      skill.dagger.level = 10;
      (await Skill.findByIdAndUpdate(skill._id, { ...skill }).lean()) as ISkill;

      const equip = await equipmentEquip.equip(testCharacter, minRequiredLevelSkillDagger._id, inventoryContainer.id);

      expect(equip).toBeFalsy();

      // make sure error message send to the character
      expect(sendErrorMessageToCharacter).toHaveBeenCalled();

      // make sure item was not delete on the inventory
      const updatedInventory = await ItemContainer.findById(inventory.itemContainer);
      expect(updatedInventory?.slots[0]).not.toBeNull();
    });

    it("should not equip an item with minimum level but without minimum skill level", async () => {
      // this dagger should require a minimum level of 5 and a minimum skill level of 7
      inventoryContainer.slots[0] = minRequiredLevelSkillDagger;
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      // add dagger skills to character, level is 10 and skill level is 1
      const skill = (await Skill.findById(testCharacter.skills).lean()) as ISkill;
      skill.level = 10;
      skill.dagger.level = 1;

      (await Skill.findByIdAndUpdate(skill._id, { ...skill }).lean()) as ISkill;

      const equip = await equipmentEquip.equip(testCharacter, minRequiredLevelSkillDagger._id, inventoryContainer.id);

      expect(equip).toBeFalsy();

      // make sure error message send to the character
      expect(sendErrorMessageToCharacter).toHaveBeenCalled();

      // make sure item was not delete on the inventory
      const updatedInventory = await ItemContainer.findById(inventory.itemContainer);
      expect(updatedInventory?.slots[0]).not.toBeNull();
    });
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

      const char = await Character.findById({ _id: testCharacter._id });

      if (!char) throw new Error("Character not found");

      const attackType = await characterWeapon.getAttackType(char);

      expect(attackType).toEqual(EntityAttackType.Melee);
    });

    it("should successfully update the attack type, after equipping an item | Ranged", async () => {
      const hunter = (await Character.findByIdAndUpdate(
        testCharacter._id,
        {
          class: CharacterClass.Hunter,
        },
        { new: true }
      )) as ICharacter;
      const characterAttackTypeBeforeEquip = await Character.findById({ _id: testCharacter._id });

      if (!characterAttackTypeBeforeEquip) throw new Error("Character not found");

      const attackType = await characterWeapon.getAttackType(characterAttackTypeBeforeEquip);

      expect(EntityAttackType.Melee).toEqual(attackType);

      inventoryContainer.slots[0] = bowItem;
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      const equip = await equipmentEquip.equip(hunter, bowItem._id, inventoryContainer.id);

      expect(equip).toBeTruthy();

      const characterAttackTypeAfterEquip = await Character.findById({ _id: testCharacter._id });

      if (!characterAttackTypeAfterEquip) throw new Error("Character not found");

      const attackTypeAfterEquip = await characterWeapon.getAttackType(characterAttackTypeAfterEquip);

      expect(attackTypeAfterEquip).toEqual(EntityAttackType.Ranged);
    });

    it("should successfully update the attack type, after equipping an item | Sword/Sword", async () => {
      inventoryContainer.slots[1] = swordItem;
      inventoryContainer.slots[0] = swordItem;
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      const characterAttackTypeBeforeEquip = await Character.findById({ _id: testCharacter._id });

      if (!characterAttackTypeBeforeEquip) throw new Error("Character not found");

      const attackTypeBeforeEquip = await characterWeapon.getAttackType(characterAttackTypeBeforeEquip);

      expect(EntityAttackType.Melee).toEqual(attackTypeBeforeEquip);

      const equipSword = await equipmentEquip.equip(testCharacter, swordItem._id, inventoryContainer.id);

      expect(inventoryContainer.slots[0].rangeType).toEqual(EntityAttackType.Melee);
      expect(inventoryContainer.slots[1].rangeType).toEqual(EntityAttackType.Melee);
      expect(equipSword).toBeTruthy();

      const characterAttackTypeAfterEquip = await Character.findById({ _id: testCharacter._id });

      if (!characterAttackTypeAfterEquip) throw new Error("Character not found");

      const attackTypeAfterEquip = await characterWeapon.getAttackType(characterAttackTypeAfterEquip);

      expect(attackTypeAfterEquip).toEqual(EntityAttackType.Melee);
    });

    it("should successfully update the attack type, after equipping an item | Sword and Shield", async () => {
      inventoryContainer.slots[1] = shieldItem;
      inventoryContainer.slots[0] = swordItem;
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      const characterAttackTypeBeforeEquip = await Character.findById({ _id: testCharacter._id });

      if (!characterAttackTypeBeforeEquip) throw new Error("Character not found");

      const attackTypeBeforeEquip = await characterWeapon.getAttackType(characterAttackTypeBeforeEquip);

      expect(attackTypeBeforeEquip).toEqual(EntityAttackType.Melee);

      const equipShield = await equipmentEquip.equip(testCharacter, shieldItem._id, inventoryContainer.id);
      expect(equipShield).toBeTruthy();

      const equipSword = await equipmentEquip.equip(testCharacter, swordItem._id, inventoryContainer.id);
      expect(equipSword).toBeTruthy();

      const characterAttackTypeAfterEquip = await Character.findById({ _id: testCharacter._id });

      if (!characterAttackTypeAfterEquip) throw new Error("Character not found");

      const attackTypeAfterEquip = await characterWeapon.getAttackType(characterAttackTypeAfterEquip);

      expect(attackTypeAfterEquip).toEqual(EntityAttackType.Melee);
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

      if (!characterAttackTypeAfterEquip) throw new Error("Character not found");

      const attackTypeAfterEquip = await characterWeapon.getAttackType(characterAttackTypeAfterEquip);

      expect(attackTypeAfterEquip).toEqual(EntityAttackType.Melee);
    });

    it("should have attack type of Melee when unarmed | Unarmed[Melee] ", async () => {
      const characterAttackType = await Character.findById({ _id: testCharacter._id });

      const weapon = await characterWeapon.getWeapon(testCharacter as ICharacter);

      const attackType = await characterWeapon.getAttackType(characterAttackType as ICharacter);

      expect(attackType).toEqual(EntityAttackType.Melee);
      expect(weapon).toBeUndefined();
    });

    it("properly calculates the totalEquippedAttack and totalEquippedDefense", async () => {
      inventoryContainer.slots[0] = swordItem;
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      const equip = await equipmentEquip.equip(testCharacter, swordItem._id, inventoryContainer.id);

      expect(equip).toBeTruthy();

      const equipment = await Equipment.findById(testCharacter.equipment);

      if (!equipment) throw new Error("Equipment not found");

      const totalEquippedAttack = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "attack");

      const totalEquippedDefense = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "defense");

      expect(totalEquippedAttack).toEqual(5);

      expect(totalEquippedDefense).toEqual(0);
    });

    it("makes sure ownership is added after equipping and item, and coordinates are wiped out", async () => {
      inventoryContainer.slots[0] = swordItem;
      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      const equip = await equipmentEquip.equip(testCharacter, swordItem._id, inventoryContainer.id);

      expect(equip).toBeTruthy();

      swordItem = (await Item.findById(swordItem._id)) as IItem;

      expect(swordItem.owner).toEqual(testCharacter._id);
      expect(swordItem.x).toBeUndefined();
      expect(swordItem.y).toBeUndefined();
      expect(swordItem.scene).toBeUndefined();
    });

    describe("Classes", () => {
      it("A berserker should be allowed to equip 2 one handed swords", async () => {
        testCharacter.class = CharacterClass.Berserker;
        await testCharacter.save();

        inventoryContainer.slots[1] = swordItem;
        inventoryContainer.slots[0] = swordItem;
        inventoryContainer.markModified("slots");
        await inventoryContainer.save();

        const characterAttackTypeBeforeEquip = await Character.findById({ _id: testCharacter._id });

        if (!characterAttackTypeBeforeEquip) throw new Error("Character not found");

        const attackTypeBeforeEquip = await characterWeapon.getAttackType(characterAttackTypeBeforeEquip);

        expect(attackTypeBeforeEquip).toEqual(EntityAttackType.Melee);

        const equipSword1 = await equipmentEquip.equip(testCharacter, swordItem._id, inventoryContainer.id);
        expect(equipSword1).toBeTruthy();

        const equipSword2 = await equipmentEquip.equip(testCharacter, swordItem._id, inventoryContainer.id);
        expect(equipSword2).toBeTruthy();
      });
    });

    describe("Item Allowed", () => {
      it("should call isItemAllowed method if item type Weapon or item sub type Book or Shield ", async () => {
        // this should call isItemAllowed
        testItem.type = "Weapon";
        // @ts-ignore
        await equipmentEquip.isEquipValid(testCharacter, testItem, inventoryContainer);

        // this should call isItemAllowed
        testItem.type = "other";
        testItem.subType = "Book";
        // @ts-ignore
        await equipmentEquip.isEquipValid(testCharacter, testItem, inventoryContainer);

        // this should call isItemAllowed
        testItem.type = "other";
        testItem.subType = "Shield";
        // @ts-ignore
        await equipmentEquip.isEquipValid(testCharacter, testItem, inventoryContainer);

        // this should not call isItemAllowed
        testItem.type = "other";
        testItem.subType = "other";
        // @ts-ignore
        await equipmentEquip.isEquipValid(testCharacter, testItem, inventoryContainer);

        expect(isItemAllowed).toHaveBeenCalledTimes(3);
      });
    });
  });
});
