import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterWeapon } from "@providers/character/CharacterWeapon";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemSocketEvents, ItemSubType, ItemType, UISocketEvents } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { EquipmentSlots } from "../EquipmentSlots";
import { EquipmentUnequip } from "../EquipmentUnequip";

describe("EquipmentUnequip.spec.ts", () => {
  let equipmentUnequip: EquipmentUnequip;
  let equipment: IEquipment;
  let testItem: IItem;
  let testStackableItem: IItem;
  let testCharacter: ICharacter;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;
  let equipmentSlots: EquipmentSlots;
  let socketMessaging;
  let characterWeapon: CharacterWeapon;

  beforeAll(() => {
    equipmentUnequip = container.get<EquipmentUnequip>(EquipmentUnequip);
    equipmentSlots = container.get<EquipmentSlots>(EquipmentSlots);
    characterWeapon = container.get<CharacterWeapon>(CharacterWeapon);
  });

  beforeEach(async () => {
    testItem = (await unitTestHelper.createMockItem()) as unknown as IItem;
    testStackableItem = (await unitTestHelper.createStackableMockItem({
      stackQty: 25,
      maxStackSize: 50,
    })) as unknown as IItem;
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
    });
    equipment = (await Equipment.findById(testCharacter.equipment)) as unknown as IEquipment;

    // Equip with a basic short sword and stackable item
    equipment.leftHand = testItem._id;
    equipment.accessory = testStackableItem._id;
    await equipment.save();

    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    // @ts-ignore
    socketMessaging = jest.spyOn(equipmentUnequip.socketMessaging, "sendEventToUser");
  });

  it("Should sucessfully unequip an item", async () => {
    const unequip = await equipmentUnequip.unequip(testCharacter, inventory, testItem);
    expect(unequip).toBeTruthy();

    const slots = await equipmentSlots.getEquipmentSlots(testCharacter.equipment as unknown as string);

    expect(slots.leftHand).toBeUndefined();
  });

  it("Should successfully trigger a inventory and equipment update event, when unequip is successful", async () => {
    const unequip = await equipmentUnequip.unequip(testCharacter, inventory, testItem);
    expect(unequip).toBeTruthy();

    const slots = await equipmentSlots.getEquipmentSlots(testCharacter.equipment as unknown as string);

    const inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    expect(socketMessaging).toHaveBeenCalledWith(
      testCharacter.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      {
        equipment: slots,
        inventory: inventoryContainer,
      }
    );
  });

  it("Should update the character attack type, when unequipping", async () => {
    const bowBlueprint = itemsBlueprintIndex[RangedWeaponsBlueprint.Bow];

    const rangedItem = await unitTestHelper.createMockItem({
      ...bowBlueprint,
    });

    equipment.leftHand = rangedItem._id;
    await equipment.save();

    const attackType = await characterWeapon.getAttackType(testCharacter);
    expect(attackType).toBe(EntityAttackType.Ranged);

    const unequip = await equipmentUnequip.unequip(testCharacter, inventory, rangedItem);
    expect(unequip).toBeTruthy();

    const attackTypePostUnequip = await characterWeapon.getAttackType(testCharacter);

    expect(attackTypePostUnequip).toBe(EntityAttackType.Melee);
  });
  describe("Decrease attack and defense", () => {
    const DECREASE_VALUE = 2;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async function fetchItem(itemId: any) {
      const item = await Item.findById(itemId);
      // Note: Ensure Item has attack and defense properties in its model
      return item as unknown as { attack: number; defense: number; _id: string };
    }

    it("should decrease the attack and defense values if the item type is Weapon and accessory subtype is Book", async () => {
      // Arrange
      const weaponItem = await unitTestHelper.createMockItem({ type: ItemType.Weapon });
      const bookAccessory = await unitTestHelper.createMockItem({ subType: ItemSubType.Book });

      equipment.rightHand = weaponItem._id;
      equipment.accessory = bookAccessory._id;
      await equipment.save();

      const originalWeaponItem = await fetchItem(weaponItem._id);

      // Act
      const unequip = await equipmentUnequip.unequip(testCharacter, inventory, weaponItem);

      // Assert
      expect(unequip).toBeTruthy();

      const updatedWeaponItem = await fetchItem(weaponItem._id);

      expect(updatedWeaponItem.attack).toBe(originalWeaponItem.attack - DECREASE_VALUE);
      expect(updatedWeaponItem.defense).toBe(originalWeaponItem.defense - DECREASE_VALUE);
    });

    it("should decrease the attack and defense values if the item subtype is Book and the left and right hand items are Weapons", async () => {
      // Arrange
      const bookItem = await unitTestHelper.createMockItem({ subType: ItemSubType.Book });
      const leftHandWeapon = await unitTestHelper.createMockItem({ type: ItemType.Weapon });
      const rightHandWeapon = await unitTestHelper.createMockItem({ type: ItemType.Weapon });

      equipment.leftHand = leftHandWeapon._id;
      equipment.rightHand = rightHandWeapon._id;
      equipment.accessory = bookItem._id;
      await equipment.save();

      const originalLeftHandWeapon = await fetchItem(leftHandWeapon._id);
      const originalRightHandWeapon = await fetchItem(rightHandWeapon._id);

      // Act
      const unequip = await equipmentUnequip.unequip(testCharacter, inventory, bookItem);

      // Assert
      expect(unequip).toBeTruthy();

      const updatedLeftHandWeapon = await fetchItem(leftHandWeapon._id);
      const updatedRightHandWeapon = await fetchItem(rightHandWeapon._id);

      expect(updatedLeftHandWeapon.attack).toBe(originalLeftHandWeapon.attack - DECREASE_VALUE);
      expect(updatedLeftHandWeapon.defense).toBe(originalLeftHandWeapon.defense - DECREASE_VALUE);

      expect(updatedRightHandWeapon.attack).toBe(originalRightHandWeapon.attack - DECREASE_VALUE);
      expect(updatedRightHandWeapon.defense).toBe(originalRightHandWeapon.defense - DECREASE_VALUE);
    });
  });

  describe("Validation cases", () => {
    it("should not unequip an equipment that the character does not have on equipment", async () => {
      equipment.leftHand = undefined;
      await equipment.save();

      const unequip = await equipmentUnequip.unequip(testCharacter, inventory, testItem);

      expect(unequip).toBeFalsy();

      expect(socketMessaging).toHaveBeenCalledWith(testCharacter.channelId!, UISocketEvents.ShowMessage, {
        message: "Sorry, you cannot unequip an item that you don't have.",
        type: "error",
      });
    });

    it("should fail if the inventory container is full", async () => {
      const anotherItem = (await unitTestHelper.createMockItem()) as unknown as IItem;

      inventoryContainer = await unitTestHelper.addItemsToContainer(inventoryContainer, 1, [anotherItem]);

      const unequip = await equipmentUnequip.unequip(testCharacter, inventory, testItem);

      expect(unequip).toBeFalsy();

      expect(socketMessaging).toHaveBeenCalledWith(testCharacter.channelId!, UISocketEvents.ShowMessage, {
        message: "Sorry, your inventory is full.",
        type: "error",
      });

      expect(equipment.leftHand).toBe(testItem._id);
    });
  });

  describe("Edge cases", () => {
    it("Should properly combine stackable items, on unequip", async () => {
      const anotherStackableItem = (await unitTestHelper.createStackableMockItem({
        stackQty: 25,
        maxStackSize: 50,
      })) as unknown as IItem;

      inventoryContainer = await unitTestHelper.addItemsToContainer(inventoryContainer, 1, [anotherStackableItem]);

      const unequip = await equipmentUnequip.unequip(testCharacter, inventory, testStackableItem);
      expect(unequip).toBeTruthy();

      const slots = await equipmentSlots.getEquipmentSlots(testCharacter.equipment as unknown as string);

      expect(slots.accessory).toBeNull();

      const inventoryContainerUpdated = (await ItemContainer.findById(
        inventory.itemContainer
      )) as unknown as IItemContainer;

      expect(inventoryContainerUpdated.slots[0]._id).toEqual(anotherStackableItem._id);
      expect(inventoryContainerUpdated.slots[0].stackQty).toBe(50);
    });
  });
});
