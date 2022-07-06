import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { IItem, ItemType } from "@rpg-engine/shared";
import { EquipmentEquipNetwork } from "./EquipmentEquipNetwork";

describe("EquipmentEquipNetwork.spec.ts", () => {
  let equipmentEquipNetwork: EquipmentEquipNetwork;
  let equipment: IEquipment;
  let item: IItem;
  let character: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    equipmentEquipNetwork = container.get<EquipmentEquipNetwork>(EquipmentEquipNetwork);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    equipment = await unitTestHelper.createEquipment();
    item = (await unitTestHelper.createMockItem({ x: 10, y: 10 })) as unknown as IItem;
    character = await unitTestHelper.createMockCharacter({ x: 10, y: 20 });
  });

  it("Returns true if item is on range", () => {
    const result = equipmentEquipNetwork.isItemOnRange(character, item);

    expect(result).toBe(true);
  });

  it("Returns false if item is out of range", () => {
    character.x = 200;
    const result = equipmentEquipNetwork.isItemOnRange(character, item);

    expect(result).toBe(false);
  });

  it("Returns the same item id if equip item from inventory", async () => {
    const result = await equipmentEquipNetwork.getItemId(false, item);
    expect(result).toBe(item._id);
  });

  it("Returns new item id if equip item from map", async () => {
    const result = await equipmentEquipNetwork.getItemId(true, item);
    expect(result).not.toBe(item._id);
  });

  it("Should get the equipment slots", async () => {
    const result = await equipmentEquipNetwork.getEquipmentSlots(equipment._id);

    const itemHead = result.head as IItem;
    const itemNeck = result.neck as IItem;

    expect(itemHead._id).toEqual(equipment.head);
    expect(itemHead.name).toBe("Short Sword");

    expect(itemNeck._id).toEqual(equipment.neck);
    expect(itemNeck.name).toBe("Short Sword");
  });

  it("Should get allowed item types", async () => {
    const allowedItemTypes = await equipmentEquipNetwork.getAllowedItemTypes();

    expect(allowedItemTypes).toEqual(Object.keys(ItemType));
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
