import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ItemSlotType } from "@rpg-engine/shared";
import { EquipmentEquip } from "../EquipmentEquip";
import { EquipmentTwoHanded } from "../EquipmentTwoHanded";

describe("EquipmentTwoHanded.spec.ts", () => {
  let equipmentEquip: EquipmentEquip;

  let item: IItem;
  let itemTwoHanded: IItem;
  let testCharacter: ICharacter;
  let equipmentTwoHanded: EquipmentTwoHanded;

  const tryToEquipItemWithAnotherAlreadyEquipped = async (
    inventoryContainer: IItemContainer,
    slot: "leftHand" | "rightHand",
    equipment: IEquipment,
    alreadyEquippedItem: IItem,
    itemToBeEquipped: IItem
  ): Promise<void> => {
    // @ts-ignore
    equipment[slot] = alreadyEquippedItem._id;
    await equipment.save();

    inventoryContainer.slots[0] = itemToBeEquipped;
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    await equipmentEquip.equip(testCharacter, itemToBeEquipped._id, inventoryContainer?._id);
  };

  beforeAll(() => {
    equipmentEquip = container.get<EquipmentEquip>(EquipmentEquip);
    equipmentTwoHanded = container.get<EquipmentTwoHanded>(EquipmentTwoHanded);
  });

  beforeEach(async () => {
    item = (await unitTestHelper.createMockItem({ x: 10, y: 10 })) as unknown as IItem;
    itemTwoHanded = (await unitTestHelper.createMockItemTwoHanded()) as unknown as IItem;
    testCharacter = await unitTestHelper.createMockCharacter(
      { x: 10, y: 20 },
      { hasEquipment: true, hasInventory: true, hasSkills: true }
    );
  });

  it("should properly equip a stack item", async () => {});

  it("Should equip two handed weapon", async () => {
    const inventory = await testCharacter.inventory;
    const container = await ItemContainer.findById(inventory.itemContainer);

    if (container) {
      container.slots[0] = itemTwoHanded;
      container.markModified("slots");
      await container.save();
      await equipmentEquip.equip(testCharacter, itemTwoHanded._id, container?._id);

      const containerPostUpdate = await ItemContainer.findById(inventory.itemContainer);
      const equipmentPostUpdate = (await Equipment.findById(testCharacter.equipment)) as IEquipment;

      expect(containerPostUpdate?.slots[0]).toBeNull;
      expect(equipmentPostUpdate.leftHand?.toString()).toBe(itemTwoHanded._id.toString());
    }
  });

  describe("validateHandsItemEquip", () => {
    let equipmentSlots: any;
    let itemToBeEquipped: IItem;
    let character: ICharacter;

    beforeEach(() => {
      equipmentSlots = {
        leftHand: null,
        rightHand: null,
      };
      itemToBeEquipped = {
        isTwoHanded: false,
      } as IItem;
      character = {
        channelId: "1",
      } as ICharacter;
    });

    it("should return true if the item is not equippable on hands", async () => {
      itemToBeEquipped.allowedEquipSlotType = [ItemSlotType.Head];
      const result = await equipmentTwoHanded.validateHandsItemEquip(equipmentSlots, itemToBeEquipped, character);
      expect(result).toBe(true);
    });

    it("should return true if the item is a one-handed item and no one-handed item is equipped", async () => {
      itemToBeEquipped.isTwoHanded = false;
      const result = await equipmentTwoHanded.validateHandsItemEquip(equipmentSlots, itemToBeEquipped, character);
      expect(result).toBe(true);
    });

    it("should return true if the item is a one-handed item and a one-handed item is already equipped", async () => {
      itemToBeEquipped.isTwoHanded = false;
      equipmentSlots.leftHand = "itemId";
      const result = await equipmentTwoHanded.validateHandsItemEquip(equipmentSlots, itemToBeEquipped, character);
      expect(result).toBe(true);
    });

    it("should return false if the item is a two-handed item and a one-handed item is already equipped", async () => {
      itemToBeEquipped.isTwoHanded = true;
      itemToBeEquipped.allowedEquipSlotType = [ItemSlotType.LeftHand, ItemSlotType.RightHand];
      equipmentSlots.leftHand = "itemId";

      const equipmentTwoHandedMock = {
        hasOneHandedItemEquippedOnArms: jest.fn().mockReturnValue(true),
      };

      equipmentTwoHanded.hasOneHandedItemEquippedOnArms = equipmentTwoHandedMock.hasOneHandedItemEquippedOnArms;

      const result = await equipmentTwoHanded.validateHandsItemEquip(equipmentSlots, itemToBeEquipped, character);
      expect(result).toBe(false);
    });

    it("should return false if the item is a two-handed item and a two-handed item is already equipped", async () => {
      itemToBeEquipped.isTwoHanded = true;
      itemToBeEquipped.allowedEquipSlotType = [ItemSlotType.LeftHand, ItemSlotType.RightHand];
      equipmentSlots.leftHand = "itemId";
      equipmentSlots.rightHand = "itemId";

      const equipmentTwoHandedMock = {
        hasTwoHandedItemEquippedOnArms: jest.fn().mockReturnValue(true),
        hasOneHandedItemEquippedOnArms: jest.fn().mockReturnValue(false),
      };

      equipmentTwoHanded.hasTwoHandedItemEquippedOnArms = equipmentTwoHandedMock.hasTwoHandedItemEquippedOnArms;
      equipmentTwoHanded.hasOneHandedItemEquippedOnArms = equipmentTwoHandedMock.hasOneHandedItemEquippedOnArms;

      const result = await equipmentTwoHanded.validateHandsItemEquip(equipmentSlots, itemToBeEquipped, character);
      expect(result).toBe(false);
    });
  });
});
