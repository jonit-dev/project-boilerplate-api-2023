import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterWeightCalculator } from "../CharacterWeightCalculator";

describe("CharacterWeightCalculator", () => {
  let characterWeightCalculator: CharacterWeightCalculator;
  let testCharacter: ICharacter;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;
  let testItem: IItem;
  let testStackableItem: IItem;

  beforeAll(() => {
    characterWeightCalculator = container.get(CharacterWeightCalculator);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
    });

    inventory = await testCharacter.inventory;
    testItem = await unitTestHelper.createMockItem();
    testStackableItem = await unitTestHelper.createStackableMockItem({
      stackQty: 100,
    });

    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer).lean()) as unknown as IItemContainer;
  });

  it("should properly calculate the character weight from inventory", async () => {
    await ItemContainer.updateOne(
      {
        _id: inventoryContainer._id,
      },
      {
        $set: {
          slots: {
            ...inventoryContainer.slots,
            0: testItem._id,
            1: testStackableItem._id,
          },
        },
      }
    );

    const weight = await characterWeightCalculator.calculateWeightFromInventory(testCharacter);

    expect(weight).toBe(6);
  });

  it("should properly calculate the character weight from equipment", async () => {
    const equipment = (await Equipment.findOne({
      owner: testCharacter._id,
    }).lean()) as unknown as IEquipment;

    await Equipment.updateOne(
      {
        _id: equipment._id,
      },
      {
        $set: {
          leftHand: testItem._id,
        },
      }
    );

    const weight = await characterWeightCalculator.calculateWeightFromEquipment(testCharacter);

    expect(weight).toBe(4);
  });
});
