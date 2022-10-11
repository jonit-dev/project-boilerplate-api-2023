import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemSocketEvents, UISocketEvents } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { EquipmentRangeUpdate } from "../EquipmentRangeUpdate";
import { EquipmentSlots } from "../EquipmentSlots";

import { EquipmentUnequip } from "../EquipmentUnequip";

describe("EquipmentUnequip.spec.ts", () => {
  let equipmentRangeUpdate: EquipmentRangeUpdate;
  let equipmentUnequip: EquipmentUnequip;
  let equipment: IEquipment;
  let testItem: IItem;
  let testStackableItem: IItem;
  let testCharacter: ICharacter;

  let inventory: IItem;
  let inventoryContainer: IItemContainer;
  let equipmentSlots: EquipmentSlots;

  let socketMessaging;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    equipmentUnequip = container.get<EquipmentUnequip>(EquipmentUnequip);
    equipmentSlots = container.get<EquipmentSlots>(EquipmentSlots);
    equipmentRangeUpdate = container.get<EquipmentRangeUpdate>(EquipmentRangeUpdate);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

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

    await equipmentRangeUpdate.updateCharacterAttackType(testCharacter, rangedItem);

    expect(testCharacter.attackType).toBe(EntityAttackType.Ranged);

    const unequip = await equipmentUnequip.unequip(testCharacter, inventory, rangedItem);
    expect(unequip).toBeTruthy();

    expect(testCharacter.attackType).toBe(EntityAttackType.Melee);
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

      inventoryContainer = await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 1, [anotherItem]);

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

      inventoryContainer = await unitTestHelper.addItemsToInventoryContainer(inventoryContainer, 1, [
        anotherStackableItem,
      ]);

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

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
