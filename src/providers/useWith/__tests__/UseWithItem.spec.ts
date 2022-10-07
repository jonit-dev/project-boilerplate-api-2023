/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { IUseWithItem } from "@rpg-engine/shared";
import { useWithItemBlueprints } from "../blueprints/UseWithItemBlueprints";
import { UseWithItem } from "../network/UseWithItem";

describe("UseWithItem.ts", () => {
  const ATTACK_INCREASE = 100;
  const INVALID_ITEM_MSG = "Invalid item!";

  let targetItem: IItem,
    originItem: IItem,
    testCharacter: ICharacter,
    testCharacterEquipment: IEquipment,
    useWithItem: UseWithItem,
    useWithItemData: IUseWithItem;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    useWithItem = container.get<UseWithItem>(UseWithItem);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    testCharacterEquipment = (await Equipment.findById(testCharacter.equipment)) as unknown as IEquipment;
    originItem = await unitTestHelper.createStackableMockItem();
    targetItem = await unitTestHelper.createMockItem();

    // Define a useWithEffect functionality for the testItem
    useWithItemBlueprints[targetItem.baseKey] = async function (
      targetItem: IItem,
      originItem: IItem,
      character: ICharacter
    ) {
      switch (originItem.baseKey) {
        case "apple":
          // effect increases attack to 100
          targetItem.attack = ATTACK_INCREASE;
          await targetItem.save();
          break;
        default:
          throw new Error(INVALID_ITEM_MSG);
      }
    };

    await targetItem.save();

    useWithItemData = {
      originItemId: originItem.id,
      targetItemId: targetItem.id,
    };

    // equip character with both items
    testCharacterEquipment.rightHand = originItem._id;
    testCharacterEquipment.leftHand = targetItem._id;
    await testCharacterEquipment.save();
  });

  it("should pass all validations, run the useWithEffect and apply expected effect", async () => {
    // @ts-ignore
    const response = await useWithItem.validateData(testCharacter, useWithItemData);
    expect(response.originItem.id).toEqual(originItem.id);
    expect(response.targetItem.id).toEqual(targetItem.id);

    await response.useWithEffect(response.targetItem, response.originItem, testCharacter);
    expect(response.targetItem.attack).toEqual(ATTACK_INCREASE);
  });

  it("should fail validations | item without useWithEffect function defined", async () => {
    try {
      delete useWithItemBlueprints[targetItem.baseKey];
      // @ts-ignore
      await useWithItem.validateData(testCharacter, useWithItemData);
      throw new Error("This test should fail!");
    } catch (error: any) {
      expect(error.message).toEqual(
        `targetItem '${targetItem.baseKey}' does not have a useWithEffect function defined`
      );
    }
  });

  it("validations should fail | character does not own both items", async () => {
    try {
      testCharacterEquipment.rightHand = undefined;
      await testCharacterEquipment.save();
      // @ts-ignore
      await useWithItem.validateData(testCharacter, useWithItemData);
      throw new Error("This test should failed!");
    } catch (error: any) {
      expect(error.message).toEqual("UseWith > Character does not own the item that wants to use");
    }
  });

  it("useWithEffect should throw error if invalid originItem is passed", async () => {
    try {
      originItem.key = "invalid-item";
      const useWithEffect = useWithItemBlueprints[targetItem.baseKey];
      await useWithEffect(targetItem, originItem, testCharacter);
      throw new Error("This test should fail!");
    } catch (error: any) {
      expect(error.message).toEqual(INVALID_ITEM_MSG);
    }
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
