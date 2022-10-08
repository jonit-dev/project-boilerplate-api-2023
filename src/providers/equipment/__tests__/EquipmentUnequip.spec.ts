import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";

import { EquipmentUnequip } from "../EquipmentUnequip";

describe("EquipmentUnequip.spec.ts", () => {
  let equipmentUnequip: EquipmentUnequip;
  let equipment: IEquipment;
  let testItem: IItem;
  let testCharacter: ICharacter;

  let inventory: IItem;
  let inventoryContainer: IItemContainer;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    equipmentUnequip = container.get<EquipmentUnequip>(EquipmentUnequip);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testItem = (await unitTestHelper.createMockItem({ x: 10, y: 10 })) as unknown as IItem;
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
    });
    equipment = (await Equipment.findById(testCharacter.equipment)) as unknown as IEquipment;

    // TODO: Equip with a basic short sword and 25x arrows on accessory slot

    inventory = await testCharacter.inventory;
    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;
  });

  it("Should sucessfully unequip an item", () => {});

  it("Should successfully trigger a inventory and equipment update event, when unequip is successful", () => {});

  it("Should update the character attack type, when unequipping", () => {});

  describe("Validation cases", () => {});

  describe("Edge cases", () => {
    it("Should successfully unequip an item that's stackable", () => {});

    it("Should NOT destroy the item, if we try to unequip but the inventory container is full", () => {});
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
