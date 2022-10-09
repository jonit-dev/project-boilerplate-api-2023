import { IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EquipmentSlots } from "../EquipmentSlots";

describe("EquipmentSlots.ts", () => {
  let equipmentSlots: EquipmentSlots;
  let equipment: IEquipment;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    equipmentSlots = container.get<EquipmentSlots>(EquipmentSlots);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    equipment = await unitTestHelper.createEquipment();
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

    const itemHead = result.head as unknown as IItem;
    const itemNeck = result.neck as unknown as IItem;

    expect(itemHead._id).toEqual(equipment.head);
    expect(itemHead.name).toBe("Short Sword");

    expect(itemNeck._id).toEqual(equipment.neck);
    expect(itemNeck.name).toBe("Short Sword");
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
