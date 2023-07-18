import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ContainerSlotsCaching } from "../ContainerSlotsCaching";

describe("ContainerSlotsCaching", () => {
  let containerSlotsCaching: ContainerSlotsCaching;
  let testCharacter: ICharacter;
  let inventory: IItem;
  let inventoryContainer: IItemContainer;

  beforeAll(() => {
    containerSlotsCaching = container.get(ContainerSlotsCaching);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasInventory: true, hasEquipment: true });

    inventory = await testCharacter.inventory;

    inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;
  });

  it("should properly cache the slots when saving a container", async () => {
    const previousHash = await containerSlotsCaching.getSlotsHash(inventoryContainer._id);

    expect(previousHash).toBeDefined();

    const newItem = await unitTestHelper.createMockItem();

    inventoryContainer.slots[0] = newItem._id;

    await inventoryContainer.save();

    const newHash = await containerSlotsCaching.getSlotsHash(inventoryContainer._id);

    expect(newHash).not.toBe(previousHash);
  });
});
