import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { RangedBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { EquipmentSlots } from "../EquipmentSlots";

describe("EquipmentSlots.ts", () => {
  let equipmentSlots: EquipmentSlots;
  let equipment: IEquipment;
  let testCharacter: ICharacter;
  let socketMessaging;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    equipmentSlots = container.get<EquipmentSlots>(EquipmentSlots);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasInventory: true, hasEquipment: true });
    equipment = (await Equipment.findById(testCharacter.equipment)) as unknown as IEquipment;
    // @ts-ignore
    socketMessaging = jest.spyOn(equipmentSlots.socketMessaging, "sendErrorMessageToCharacter");
  });

  it("should properly add a NON-STACKABLE item to a equipment slot", async () => {
    const newItem = await unitTestHelper.createMockItem();
    const result = await equipmentSlots.addItemToEquipmentSlot(testCharacter, newItem, equipment);

    expect(result).toBe(true);

    const equipmentSet = await equipmentSlots.getEquipmentSlots(equipment._id);

    expect(equipmentSet).toBeTruthy();

    const leftHandItem = equipmentSet.leftHand as unknown as IItem;

    expect(leftHandItem._id).toEqual(newItem._id);
  });

  it("should properly add a STACKABLE item to an equipment slot, and stack it with the existing item (maxStackSize not reached)", async () => {
    const stackableItem = await unitTestHelper.createMockItemFromBlueprint(RangedBlueprint.Arrow, { stackQty: 10 });

    equipment.accessory = stackableItem._id;
    await equipment.save();

    const result = await equipmentSlots.addItemToEquipmentSlot(testCharacter, stackableItem, equipment);

    const slots = await equipmentSlots.getEquipmentSlots(equipment._id);

    const accessorySlotItem = slots.accessory as unknown as IItem;

    expect(result).toBe(true);
    expect(accessorySlotItem.stackQty).toEqual(20);
  });

  it("should properly add a STACKABLE item to an equipment slot, and stack it to the maximum and create the difference on the inventory", async () => {});

  it("should properly add a STACKABLE item to an EMPTY equipment slot", async () => {
    const stackableItem = await unitTestHelper.createMockItemFromBlueprint(RangedBlueprint.Arrow, { stackQty: 10 });
    const result = await equipmentSlots.addItemToEquipmentSlot(testCharacter, stackableItem, equipment);

    expect(result).toBe(true);
  });

  it("should properly tell if an slot is availble or not for NON-STACKABLE item", async () => {
    const regularItem = await unitTestHelper.createMockItem();

    equipment.leftHand = regularItem._id;
    await equipment.save();

    const isSlotAvailable = await equipmentSlots.areAllowedSlotsAvailable(regularItem.allowedEquipSlotType!, equipment);

    expect(isSlotAvailable).toBeFalsy();
  });

  it("should tell that the slot is AVAILABLE, if a STACKABLE item if not on its full capacity", async () => {
    const stackableItem = await unitTestHelper.createMockItem({ stackQty: 10, maxStackSize: 20 });

    equipment.leftHand = stackableItem._id;
    await equipment.save();

    const isSlotAvailable = await equipmentSlots.areAllowedSlotsAvailable(
      stackableItem.allowedEquipSlotType!,
      equipment
    );

    expect(isSlotAvailable).toBeTruthy();
  });

  it("should tell that a slot is NOT AVAILABLE, if a STACKABLE item is at full capacity", async () => {
    const stackableItem = await unitTestHelper.createMockItem({ stackQty: 20, maxStackSize: 20 });

    equipment.leftHand = stackableItem._id;
    await equipment.save();

    const isSlotAvailable = await equipmentSlots.areAllowedSlotsAvailable(
      stackableItem.allowedEquipSlotType!,
      equipment
    );

    expect(isSlotAvailable).toBeFalsy();
  });

  it("should get the equipment slots", async () => {
    const result = await equipmentSlots.getEquipmentSlots(equipment._id);

    expect(result).toBeTruthy();

    expect(result.inventory).toBeDefined();
  });

  describe("Validations", () => {
    it("should fail if you try to add a NON-STACKABLE item, but the slot is not empty", async () => {
      const regularItem = await unitTestHelper.createMockItem();

      equipment.leftHand = regularItem._id;
      await equipment.save();

      const result = await equipmentSlots.addItemToEquipmentSlot(testCharacter, regularItem, equipment);

      expect(result).toBe(false);

      expect(socketMessaging).toBeCalledWith(testCharacter, "Sorry, you don't have any available slots for this item.");
    });
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
