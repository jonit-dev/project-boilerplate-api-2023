import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { IItem, ItemType } from "@rpg-engine/shared";
import { EquipmentUnequipNetwork } from "../network/EquipmentUnequipNetwork";

describe("EquipmentUnequipNetwork.spec.ts", () => {
  let equipmentUnequipNetwork: EquipmentUnequipNetwork;
  let equipment: IEquipment;
  let item: IItem;
  let character: ICharacter;
  let charBody: IItem;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    equipmentUnequipNetwork = container.get<EquipmentUnequipNetwork>(EquipmentUnequipNetwork);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    equipment = await unitTestHelper.createEquipment();
    item = (await unitTestHelper.createMockItem({ x: 10, y: 10 })) as unknown as IItem;
    character = await unitTestHelper.createMockCharacter({ x: 10, y: 20 });
    charBody = (await unitTestHelper.createMockItemContainer(character)) as unknown as IItem;
  });

  it("Should return item slot if item equipped", () => {
    const itemContainer = charBody!.itemContainer as unknown as IItemContainer;
    itemContainer.slots[2] = item;

    const slot = equipmentUnequipNetwork.unEquipItemFromEquipmentSlot(itemContainer.slots, item, equipment, "NECK");

    expect(slot).toEqual(item);
  });

  it("Should return undefined if item not equipped", () => {
    const itemContainer = charBody!.itemContainer as unknown as IItemContainer;

    const slot = equipmentUnequipNetwork.unEquipItemFromEquipmentSlot(itemContainer.slots, item, equipment, "NECK");

    expect(slot).toEqual(undefined);
  });

  it("Should increase item slot quantity if item in slot, but not max quantity yet", () => {
    const itemContainer = charBody!.itemContainer as unknown as IItemContainer;
    itemContainer.slots[2] = item;
    itemContainer.slots[2].stackQty = 1;
    itemContainer.slots[2].maxStackSize = 10;

    equipmentUnequipNetwork.manageItemContainerSlots(true, character, itemContainer, itemContainer.slots[2], item);

    expect(itemContainer.slots[2].stackQty).toBe(2);
  });

  it("Should not increase item slot quantity if item in slot, but max quantity reached", () => {
    const itemContainer = charBody!.itemContainer as unknown as IItemContainer;
    itemContainer.slots[2] = item;
    itemContainer.slots[2].stackQty = 1;
    itemContainer.slots[2].maxStackSize = 1;

    equipmentUnequipNetwork.manageItemContainerSlots(true, character, itemContainer, itemContainer.slots[2], item);

    expect(itemContainer.slots[2].stackQty).toBe(1);
  });

  it("Should increase total item quantity if item not in slot, but max quantity not reached", () => {
    const itemContainer = charBody!.itemContainer as unknown as IItemContainer;

    equipmentUnequipNetwork.manageItemContainerSlots(false, character, itemContainer, itemContainer.slots[2], item);

    expect(itemContainer.totalItemsQty).toBe(1);
  });

  it("Should get the equipment slots", async () => {
    const result = await equipmentUnequipNetwork.getEquipmentSlots(equipment._id);

    const itemHead = result.head as IItem;
    const itemNeck = result.neck as IItem;

    expect(itemHead._id).toEqual(equipment.head);
    expect(itemHead.name).toBe("Short Sword");

    expect(itemNeck._id).toEqual(equipment.neck);
    expect(itemNeck.name).toBe("Short Sword");
  });

  it("Should get allowed item types", async () => {
    const allowedItemTypes = await equipmentUnequipNetwork.getAllowedItemTypes();

    expect(allowedItemTypes).toEqual(Object.keys(ItemType));
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
