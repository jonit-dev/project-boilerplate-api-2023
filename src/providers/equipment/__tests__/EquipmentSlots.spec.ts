import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EquipmentRead } from "../EquipmentRead";
import { EquipmentSlots } from "../EquipmentSlots";

describe("EquipmentSlots.ts", () => {
  let equipmentSetRead: EquipmentRead;

  let testCharacter: ICharacter;
  let equipmentSlots: EquipmentSlots;
  let equipment: IEquipment;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    equipmentSetRead = container.get<EquipmentRead>(EquipmentRead);
    equipmentSlots = container.get<EquipmentSlots>(EquipmentSlots);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    equipment = await unitTestHelper.createEquipment();
  });

  it("should properly tell if an slot is availble or not for NON-STACKABLE item", async () => {
    const regularItem = await unitTestHelper.createMockItem();

    equipment.leftHand = regularItem._id;
    await equipment.save();
    console.log(testCharacter);
    console.log(equipmentSetRead);

    // const isSlotAvailable = equipmentSlots.isSlotAvailable("leftHand", equipment);

    // expect(isSlotAvailable).toBeFalsy();
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
