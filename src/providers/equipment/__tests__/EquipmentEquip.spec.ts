import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EquipmentEquip } from "../EquipmentEquip";

describe("EquipmentEquip.spec.ts", () => {
  let testItem: IItem;
  let testCharacter: ICharacter;
  let equipmentEquip: EquipmentEquip;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });
  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testItem = await unitTestHelper.createMockItem();
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    equipmentEquip = container.get<EquipmentEquip>(EquipmentEquip);

    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;
  });

  it("should properly equip a non-stackable item", async () => {
    inventoryContainer.slots[0] = testItem;
    inventoryContainer.markModified("slots");
    await inventoryContainer.save();

    const equip = await equipmentEquip.equip(testCharacter, testItem._id, inventoryContainer.id);

    expect(equip).toBeTruthy();

    // make sure item is on the slot and update event was called

    // make sure item was delete on the inventory
  });

  it("should successfully update the attack type, after equipping an item", async () => {});

  describe("Validation", () => {
    it("should fail if the character does not have the item on the inventory (inventory source)", async () => {
      const equip = await equipmentEquip.equip(testCharacter, testItem._id, inventoryContainer.id);

      expect(equip).toBeFalsy();
    });
  });
});

afterAll(async () => {
  await unitTestHelper.afterAllJestHook();
});
