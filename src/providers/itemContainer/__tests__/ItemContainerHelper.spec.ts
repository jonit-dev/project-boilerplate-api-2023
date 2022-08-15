import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { BodiesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IItemContainer } from "@rpg-engine/shared";
import { ItemContainerHelper } from "../ItemContainerHelper";

describe("ItemContainerHelper", () => {
  let itemContainerHelper: ItemContainerHelper;
  let testCharacter: ICharacter;
  let inventory: IItem;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    itemContainerHelper = container.get<ItemContainerHelper>(ItemContainerHelper);
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    inventory = await testCharacter.inventory;
  });

  describe("itemContainer type detection", () => {
    it("should properly detect an inventory itemContainer", async () => {
      const inventoryItemContainer = await ItemContainer.findById(inventory.itemContainer);

      const type = await itemContainerHelper.getType(inventoryItemContainer as unknown as IItemContainer);
      expect(type).toBe("inventory");
    });

    it("should properly detect a loot itemContainer", async () => {
      const blueprintData = itemsBlueprintIndex[BodiesBlueprint.CharacterBody];

      const charBody = new Item({
        ...blueprintData,
        owner: testCharacter.id,
        name: `${testCharacter.name}'s body`,
        scene: testCharacter.scene,
        x: testCharacter.x,
        y: testCharacter.y,
        generateContainerSlots: 20,
        isItemContainer: true,
      });
      await charBody.save();

      const lootContainer = new ItemContainer({
        parentItem: charBody.id,
      });
      lootContainer.save();

      const type = await itemContainerHelper.getType(lootContainer as unknown as IItemContainer);

      expect(type).toBe("loot");
    });

    it("should properly detect a map-container itemContainer type", async () => {
      const mockItem = await unitTestHelper.createMockItem({
        x: testCharacter.x,
        y: testCharacter.y,
        scene: testCharacter.scene,
      });

      const mapContainer = new ItemContainer({
        parentItem: mockItem.id,
      });
      await mapContainer.save();

      const type = await itemContainerHelper.getType(mapContainer as unknown as IItemContainer);

      expect(type).toBe("map-container");
    });
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
