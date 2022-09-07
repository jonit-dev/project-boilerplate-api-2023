import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { IItem, ItemType } from "@rpg-engine/shared";
import { ObjectId } from "mongoose";
import { EquipmentEquip } from "../EquipmentEquip";

describe("EquipmentEquip.spec.ts", () => {
  let equipmentEquip: EquipmentEquip;
  let equipment: IEquipment;
  let item: IItem;
  let itemTwoHanded: IItem;
  let character: ICharacter;
  let charBody: IItem;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    equipmentEquip = container.get<EquipmentEquip>(EquipmentEquip);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    equipment = await unitTestHelper.createEquipment();
    item = (await unitTestHelper.createMockItem({ x: 10, y: 10 })) as unknown as IItem;
    itemTwoHanded = (await unitTestHelper.createMockItemTwoHanded({ x: 10, y: 10 })) as unknown as IItem;
    character = await unitTestHelper.createMockCharacter({ x: 10, y: 20 }, { hasEquipment: true, hasInventory: true });
    charBody = (await unitTestHelper.createMockItemContainer(character)) as unknown as IItem;
  });

  it("Should get the equipment slots", async () => {
    const result = await equipmentEquip.getEquipmentSlots(equipment._id);

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

  it("Should remove item from item container", async () => {
    const itemContainer = charBody!.itemContainer as unknown as IItemContainer;
    itemContainer.slots[2] = item;
    itemContainer.slots[3] = item;

    await equipmentEquip.removeItemFromInventory(item._id, itemContainer);

    expect(itemContainer.slots[2]).toBeNull();
    expect(itemContainer.slots[3]).not.toBeNull();
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

  it("Should not equip two handed weapon because there is already a weapon equipped", async () => {
    const inventory = await character.inventory;
    const container = await ItemContainer.findById(inventory.itemContainer);
    const equipment = await Equipment.findById(character.equipment);

    if (container && equipment) {
      const slot = "leftHand";
      // @ts-ignore
      equipment[slot] = item._id;
      equipment.save();

      container.slots[0] = itemTwoHanded;
      container.markModified("slots");
      await container.save();
      await equipmentEquip.equip(character, itemTwoHanded._id, container?._id);

      const containerPostUpdate = await ItemContainer.findById(inventory.itemContainer);
      const equipmentPostUpdate = (await Equipment.findById(character.equipment)) as IEquipment;

      expect(containerPostUpdate?.slots[0]).toBeDefined();
      expect(equipmentPostUpdate.leftHand?.toString()).toBe(item._id.toString());
    }
  });
});
