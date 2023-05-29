import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { unitTestHelper } from "@providers/inversify/container";
import { IItem, Item } from "../ItemModel";

describe("ItemModel", () => {
  let testCharacter: ICharacter;
  let testItem: IItem;
  let equipment: IEquipment;

  beforeEach(async () => {
    testCharacter = (await unitTestHelper.createMockCharacter(null, { hasEquipment: true })) as ICharacter;
    equipment = (await Equipment.findById(testCharacter.equipment).lean()) as IEquipment;

    if (!equipment) {
      throw new Error("Equipment not found");
    }

    testItem = await unitTestHelper.createMockItem({ owner: testCharacter._id });

    await Equipment.updateOne(
      { _id: equipment._id },
      {
        $set: {
          leftHand: testItem._id,
        },
      }
    );
  });

  it("should trigger the deletion protection if the item is equipped", async () => {
    equipment = (await Equipment.findById(testCharacter.equipment)) as IEquipment;

    const isEquipped = equipment.isEquipped(testItem._id);

    expect(isEquipped).toBe(true);

    await expect(testItem.remove()).rejects.toThrow("Cannot delete item because it is equipped");

    await expect(Item.deleteOne({ _id: testItem._id })).rejects.toThrow("Cannot delete item because it is equipped");

    // now lets unequip the item

    equipment.leftHand = undefined;
    await equipment.save();

    await expect(testItem.remove()).resolves.not.toThrow();
  });

  it("skipEquipmentCheck flag should skip the check", async () => {
    equipment = (await Equipment.findById(testCharacter.equipment)) as IEquipment;

    await expect(
      Item.deleteOne(
        { _id: testItem._id },
        {
          skipEquipmentCheck: true,
        }
      )
    ).resolves.not.toThrow();
  });
});
