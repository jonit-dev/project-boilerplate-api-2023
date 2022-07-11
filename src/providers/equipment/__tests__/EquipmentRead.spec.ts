import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EquipmentRead } from "../EquipmentRead";
import { IEquipementSet, ItemSocketEvents, UISocketEvents } from "@rpg-engine/shared";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";

describe("EquipmentRead.ts", () => {
  let equipmentSetRead: EquipmentRead;

  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    equipmentSetRead = container.get<EquipmentRead>(EquipmentRead);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await unitTestHelper.createMockCharacter();
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

    // @ts-ignore
    expect(equipmentSetRead.socketMessaging.sendEventToUser).toHaveReturnedWith(IEquipementSet);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
