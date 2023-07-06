import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EquipmentSocketEvents, UISocketEvents } from "@rpg-engine/shared";
import { EquipmentRead } from "../EquipmentRead";
import { EquipmentSlots } from "../EquipmentSlots";

describe("EquipmentRead.ts", () => {
  let equipmentSetRead: EquipmentRead;

  let testCharacter: ICharacter;
  let equipmentSlots: EquipmentSlots;

  beforeAll(async () => {
    equipmentSetRead = container.get<EquipmentRead>(EquipmentRead);
    equipmentSlots = container.get<EquipmentSlots>(EquipmentSlots);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true });
  });

  it("should automatically create an equipment set", async () => {
    const equipmentSet = await Equipment.findById(testCharacter.equipment);

    expect(equipmentSet).toBeDefined();
  });

  it("should throw an error if equipment set is not found", async () => {
    // @ts-ignore
    jest.spyOn(equipmentSetRead.socketMessaging, "sendEventToUser" as any);

    const equipmentSet = await Equipment.findById(testCharacter.equipment);

    if (equipmentSet) {
      await equipmentSet.remove();

      const fetchEquipment = await Equipment.findById(testCharacter.equipment);

      expect(fetchEquipment).toBeNull();
      expect(fetchEquipment).toBeDefined();

      await equipmentSetRead.onEquipmentRead(testCharacter);

      // @ts-ignore
      expect(equipmentSetRead.socketMessaging.sendEventToUser).toHaveBeenCalledWith(
        testCharacter.channelId!,
        UISocketEvents.ShowMessage,
        {
          message: "Equipment Set not found.",
          type: "error",
        }
      );
    }
  });

  it("should open equipment set", async () => {
    // @ts-ignore
    jest.spyOn(equipmentSetRead.socketMessaging, "sendEventToUser" as any);

    await equipmentSetRead.onEquipmentRead(testCharacter);

    const fetchEquipment = await Equipment.findById(testCharacter.equipment);

    if (!fetchEquipment) {
      throw new Error("Equipment set not found.");
    }

    const slots = await equipmentSlots.getEquipmentSlots(testCharacter._id, fetchEquipment?._id);

    // @ts-ignore
    expect(equipmentSetRead.socketMessaging.sendEventToUser).toHaveBeenCalledWith(
      testCharacter.channelId!,
      EquipmentSocketEvents.ContainerRead,
      {
        equipment: slots,
      }
    );
  });
});
