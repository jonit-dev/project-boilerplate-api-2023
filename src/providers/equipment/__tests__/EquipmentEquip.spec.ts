import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { IItem, ItemType } from "@rpg-engine/shared";
import { EquipmentEquip } from "../EquipmentEquip";

describe("EquipmentEquip.spec.ts", () => {
  let equipmentEquip: EquipmentEquip;
  let equipment: IEquipment;
  let item: IItem;
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
    character = await unitTestHelper.createMockCharacter({ x: 10, y: 20 });
    charBody = (await unitTestHelper.createMockItemContainer(character)) as unknown as IItem;
  });

  it("Returns new item id if equip item from map", async () => {
    const result = await equipmentEquip.getItemId(item);
    expect(result).not.toBe(item._id);
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
});
