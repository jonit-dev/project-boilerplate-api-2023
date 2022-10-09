import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ItemType, UISocketEvents } from "@rpg-engine/shared";
import { EquipmentEquip } from "../EquipmentEquip";
import { EquipmentSlots } from "../EquipmentSlots";

describe("EquipmentEquip.spec.ts", () => {
  let equipmentEquip: EquipmentEquip;
  let equipment: IEquipment;
  let item: IItem;
  let itemTwoHanded: IItem;
  let testCharacter: ICharacter;
  let equipmentSlots: EquipmentSlots;
  let testItem: IItem;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    equipmentEquip = container.get<EquipmentEquip>(EquipmentEquip);
    equipmentSlots = container.get<EquipmentSlots>(EquipmentSlots);
  });

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

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    equipment = await unitTestHelper.createEquipment();
    item = (await unitTestHelper.createMockItem({ x: 10, y: 10 })) as unknown as IItem;
    itemTwoHanded = (await unitTestHelper.createMockItemTwoHanded({ x: 10, y: 10 })) as unknown as IItem;
    testCharacter = await unitTestHelper.createMockCharacter(
      { x: 10, y: 20 },
      { hasEquipment: true, hasInventory: true, hasSkills: true }
    );
    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    testItem = await unitTestHelper.createMockItem();
  });

  it("should equip an item properly", async () => {
    inventoryContainer.slots[0] = testItem;
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    await equipmentEquip.equip(testCharacter, testItem._id, inventoryContainer?._id);

    const equipment = (await Equipment.findById(testCharacter.equipment)) as unknown as IEquipment;

    expect(equipment.leftHand).toEqual(testItem._id);
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

  it("should get allowed item types", () => {
    const allowedItemTypes = equipmentEquip.getAllowedItemTypes();

    expect(allowedItemTypes).toEqual(Object.keys(ItemType));
  });

  describe("Validation", () => {
    it("should properly validate if the item is being equipped to the correct slot", () => {});

    it("should check if the character that's trying to equip an item from the inventory actually has it there", () => {});
  });

  describe("Edge cases validation", () => {
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

    it("Should not equip a one handed weapon, if a two handed weapon is already equipped", async () => {
      const inventory = await testCharacter.inventory;
      const inventoryContainer = await ItemContainer.findById(inventory.itemContainer);
      const equipment = await Equipment.findById(testCharacter.equipment);

      // @ts-ignore
      const equipError = jest.spyOn(equipmentEquip.socketMessaging, "sendEventToUser" as any);

      if (inventoryContainer && equipment) {
        await tryToEquipItemWithAnotherAlreadyEquipped(inventoryContainer, "leftHand", equipment, itemTwoHanded, item);

        expect(equipError).toHaveBeenCalledWith(testCharacter.channelId!, UISocketEvents.ShowMessage, {
          message: "Sorry, you already have a two-handed item equipped.",
          type: "error",
        });
      }
    });

    it("Should not equip two handed weapon because there is already a weapon equipped", async () => {
      const inventory = await testCharacter.inventory;
      const inventoryContainer = await ItemContainer.findById(inventory.itemContainer);
      const equipment = await Equipment.findById(testCharacter.equipment);

      // @ts-ignore
      const equipError = jest.spyOn(equipmentEquip.socketMessaging, "sendEventToUser" as any);

      if (inventoryContainer && equipment) {
        await tryToEquipItemWithAnotherAlreadyEquipped(inventoryContainer, "leftHand", equipment, item, itemTwoHanded);

        const containerPostUpdate = await ItemContainer.findById(inventory.itemContainer);
        const equipmentPostUpdate = (await Equipment.findById(testCharacter.equipment)) as IEquipment;

        expect(containerPostUpdate?.slots[0]).toBeDefined();
        expect(equipmentPostUpdate.leftHand?.toString()).toBe(item._id.toString());

        expect(equipError).toHaveBeenCalledWith(testCharacter.channelId!, UISocketEvents.ShowMessage, {
          message: "Sorry, you already have an item equipped on your hands.",
          type: "error",
        });
      }
    });
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
