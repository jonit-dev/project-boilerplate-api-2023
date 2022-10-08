import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ItemType } from "@rpg-engine/shared";

import { EquipmentSlots } from "../EquipmentSlots";
import { EquipmentUnequip } from "../EquipmentUnequip";

describe("EquipmentUnequip.spec.ts", () => {
  let equipmentUnequip: EquipmentUnequip;
  let equipment: IEquipment;
  let item: IItem;
  let testCharacter: ICharacter;
  let charBody: IItem;
  let equipmentSlots: EquipmentSlots;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    equipmentUnequip = container.get<EquipmentUnequip>(EquipmentUnequip);
    equipmentSlots = container.get<EquipmentSlots>(EquipmentSlots);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    equipment = await unitTestHelper.createEquipment();
    item = (await unitTestHelper.createMockItem({ x: 10, y: 10 })) as unknown as IItem;
    testCharacter = await unitTestHelper.createMockCharacter(
      { x: 10, y: 20 },
      {
        hasEquipment: true,
        hasInventory: true,
      }
    );
    charBody = (await unitTestHelper.createMockItemContainer(testCharacter)) as unknown as IItem;

    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;
  });

  it("Should increase item slot quantity if item in slot, but not max quantity yet", () => {
    const itemContainer = charBody!.itemContainer as unknown as IItemContainer;
    itemContainer.slots[2] = item;
    itemContainer.slots[2].stackQty = 1;
    itemContainer.slots[2].maxStackSize = 10;

    equipmentUnequip.manageItemContainerSlots(true, testCharacter, itemContainer, itemContainer.slots[2], item);

    expect(itemContainer.slots[2].stackQty).toBe(2);
  });

  it("Should not increase item slot quantity if item in slot, but max quantity reached", () => {
    const itemContainer = charBody!.itemContainer as unknown as IItemContainer;
    itemContainer.slots[2] = item;
    itemContainer.slots[2].stackQty = 1;
    itemContainer.slots[2].maxStackSize = 1;

    equipmentUnequip.manageItemContainerSlots(true, testCharacter, itemContainer, itemContainer.slots[2], item);

    expect(itemContainer.slots[2].stackQty).toBe(1);
  });

  it("Should increase total item quantity if item not in slot, but max quantity not reached", () => {
    const itemContainer = charBody!.itemContainer as unknown as IItemContainer;

    equipmentUnequip.manageItemContainerSlots(false, testCharacter, itemContainer, itemContainer.slots[2], item);

    expect(itemContainer.totalItemsQty).toBe(1);
  });

  it("Should get the equipment slots", async () => {
    const result = await equipmentSlots.getEquipmentSlots(equipment._id);

    const itemHead = result.head! as unknown as IItem;
    const itemNeck = result.neck as unknown as IItem;

    expect(itemHead._id).toEqual(equipment.head);
    expect(itemHead.name).toBe("Short Sword");

    expect(itemNeck._id).toEqual(equipment.neck);
    expect(itemNeck.name).toBe("Short Sword");
  });

  it("Should get allowed item types", async () => {
    const allowedItemTypes = await equipmentUnequip.getAllowedItemTypes();

    expect(allowedItemTypes).toEqual(Object.keys(ItemType));
  });

  it("should NOT destroy the item, if we try to unequip it but the inventory container is full", async () => {});

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
