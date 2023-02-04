import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ContainersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { EquipmentEquipInventory } from "../EquipmentEquipInventory";
import { EquipmentSlots } from "../EquipmentSlots";

describe("EquipmentRangeUpdate.spec.ts", () => {
  let inventoryItem: IItem;
  let character: ICharacter;
  let equipmentEquipInventory: EquipmentEquipInventory;
  let equipment: IEquipment;
  let equipmentSlots: EquipmentSlots;

  beforeAll(async () => {
    equipmentEquipInventory = container.get<EquipmentEquipInventory>(EquipmentEquipInventory);
    equipmentSlots = container.get<EquipmentSlots>(EquipmentSlots);
  });

  beforeEach(async () => {
    inventoryItem = (await unitTestHelper.createMockItemFromBlueprint(ContainersBlueprint.Bag)) as unknown as IItem;
    character = await unitTestHelper.createMockCharacter(null, { hasEquipment: true });
    equipment = (await Equipment.findById(character.equipment)) as unknown as IEquipment;
  });

  it("should properly equip a character inventory", async () => {
    expect(equipment.inventory).toBeUndefined();

    const equipped = await equipmentEquipInventory.equipInventory(character, inventoryItem);

    expect(equipped).toBe(true);

    const equipmentSet = await equipmentSlots.getEquipmentSlots(equipment._id);

    expect(equipmentSet).toBeTruthy();

    const inventory = equipmentSet.inventory as unknown as IItem;

    expect(inventory._id).toEqual(inventoryItem._id);
  });

  it("should fail if an inventory is already equipped", async () => {
    await equipmentEquipInventory.equipInventory(character, inventoryItem);

    const equipped = await equipmentEquipInventory.equipInventory(character, inventoryItem);

    expect(equipped).toBe(false);
  });
});
