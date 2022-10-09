import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { IItem, ItemType, UISocketEvents } from "@rpg-engine/shared";
import { EquipmentEquip } from "../EquipmentEquip";
import { EquipmentSlots } from "../EquipmentSlots";

describe("EquipmentEquip.spec.ts", () => {
  let equipmentEquip: EquipmentEquip;
  let equipment: IEquipment;
  let item: IItem;
  let itemTwoHanded: IItem;
  let character: ICharacter;
  let equipmentSlots: EquipmentSlots;

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

    await equipmentEquip.equip(character, itemToBeEquipped._id, inventoryContainer?._id);
  };

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    equipment = await unitTestHelper.createEquipment();
    item = (await unitTestHelper.createMockItem({ x: 10, y: 10 })) as unknown as IItem;
    itemTwoHanded = (await unitTestHelper.createMockItemTwoHanded({ x: 10, y: 10 })) as unknown as IItem;
    character = await unitTestHelper.createMockCharacter({ x: 10, y: 20 }, { hasEquipment: true, hasInventory: true });
  });

  it("Should get the equipment slots", async () => {
    const result = await equipmentSlots.getEquipmentSlots(equipment._id);

    const itemHead = result.head as IItem;
    const itemNeck = result.neck as IItem;

    expect(itemHead._id).toEqual(equipment.head);
    expect(itemHead.name).toBe("Short Sword");

    expect(itemNeck._id).toEqual(equipment.neck);
    expect(itemNeck.name).toBe("Short Sword");
  });

  it("Should get allowed item types", async () => {
    const allowedItemTypes = await equipmentEquip.getAllowedItemTypes();

    expect(allowedItemTypes).toEqual(Object.keys(ItemType));
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });

  it("Should equip two handed weapon", async () => {
    const inventory = await character.inventory;
    const container = await ItemContainer.findById(inventory.itemContainer);

    if (container) {
      container.slots[0] = itemTwoHanded;
      container.markModified("slots");
      await container.save();
      await equipmentEquip.equip(character, itemTwoHanded._id, container?._id);

      const containerPostUpdate = await ItemContainer.findById(inventory.itemContainer);
      const equipmentPostUpdate = (await Equipment.findById(character.equipment)) as IEquipment;

      expect(containerPostUpdate?.slots[0]).toBeNull;
      expect(equipmentPostUpdate.leftHand?.toString()).toBe(itemTwoHanded._id.toString());
    }
  });

  it("Should not equip a one handed weapon, if a two handed weapon is already equipped", async () => {
    const inventory = await character.inventory;
    const inventoryContainer = await ItemContainer.findById(inventory.itemContainer);
    const equipment = await Equipment.findById(character.equipment);

    // @ts-ignore
    const equipError = jest.spyOn(equipmentEquip.socketMessaging, "sendEventToUser" as any);

    if (inventoryContainer && equipment) {
      await tryToEquipItemWithAnotherAlreadyEquipped(inventoryContainer, "leftHand", equipment, itemTwoHanded, item);

      expect(equipError).toHaveBeenCalledWith(character.channelId!, UISocketEvents.ShowMessage, {
        message: "You already have a two handed item equipped!",
        type: "error",
      });
    }
  });

  it("Should not equip two handed weapon because there is already a weapon equipped", async () => {
    const inventory = await character.inventory;
    const inventoryContainer = await ItemContainer.findById(inventory.itemContainer);
    const equipment = await Equipment.findById(character.equipment);

    // @ts-ignore
    const equipError = jest.spyOn(equipmentEquip.socketMessaging, "sendEventToUser" as any);

    if (inventoryContainer && equipment) {
      await tryToEquipItemWithAnotherAlreadyEquipped(inventoryContainer, "leftHand", equipment, item, itemTwoHanded);

      const containerPostUpdate = await ItemContainer.findById(inventory.itemContainer);
      const equipmentPostUpdate = (await Equipment.findById(character.equipment)) as IEquipment;

      expect(containerPostUpdate?.slots[0]).toBeDefined();
      expect(equipmentPostUpdate.leftHand?.toString()).toBe(item._id.toString());

      expect(equipError).toHaveBeenCalledWith(character.channelId!, UISocketEvents.ShowMessage, {
        message: "You can't equip this two handed item with another item already in your hands!",
        type: "error",
      });
    }
  });
});
