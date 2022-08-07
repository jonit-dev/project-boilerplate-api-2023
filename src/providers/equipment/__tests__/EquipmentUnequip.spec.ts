import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { IItem, ItemType } from "@rpg-engine/shared";
import { EquipmentSlots } from "../EquipmentSlots";
import { EquipmentUnequip } from "../EquipmentUnequip";

describe("EquipmentUnequip.spec.ts", () => {
  let equipmentUnequip: EquipmentUnequip;
  let equipment: IEquipment;
  let item: IItem;
  let character: ICharacter;
  let charBody: IItem;
  let equipmentSlots: EquipmentSlots;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    equipmentUnequip = container.get<EquipmentUnequip>(EquipmentUnequip);
    equipmentSlots = container.get<EquipmentSlots>(EquipmentSlots);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    equipment = await unitTestHelper.createEquipment();
    item = (await unitTestHelper.createMockItem({ x: 10, y: 10 })) as unknown as IItem;
    character = await unitTestHelper.createMockCharacter({ x: 10, y: 20 });
    charBody = (await unitTestHelper.createMockItemContainer(character)) as unknown as IItem;
  });

  it("Should increase item slot quantity if item in slot, but not max quantity yet", () => {
    const itemContainer = charBody!.itemContainer as unknown as IItemContainer;
    itemContainer.slots[2] = item;
    itemContainer.slots[2].stackQty = 1;
    itemContainer.slots[2].maxStackSize = 10;

    equipmentUnequip.manageItemContainerSlots(true, character, itemContainer, itemContainer.slots[2], item);

    expect(itemContainer.slots[2].stackQty).toBe(2);
  });

  it("Should not increase item slot quantity if item in slot, but max quantity reached", () => {
    const itemContainer = charBody!.itemContainer as unknown as IItemContainer;
    itemContainer.slots[2] = item;
    itemContainer.slots[2].stackQty = 1;
    itemContainer.slots[2].maxStackSize = 1;

    equipmentUnequip.manageItemContainerSlots(true, character, itemContainer, itemContainer.slots[2], item);

    expect(itemContainer.slots[2].stackQty).toBe(1);
  });

  it("Should increase total item quantity if item not in slot, but max quantity not reached", () => {
    const itemContainer = charBody!.itemContainer as unknown as IItemContainer;

    equipmentUnequip.manageItemContainerSlots(false, character, itemContainer, itemContainer.slots[2], item);

    expect(itemContainer.totalItemsQty).toBe(1);
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
    const allowedItemTypes = await equipmentUnequip.getAllowedItemTypes();

    expect(allowedItemTypes).toEqual(Object.keys(ItemType));
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
