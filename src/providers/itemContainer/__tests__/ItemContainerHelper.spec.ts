import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { BodiesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IItemContainer, ItemContainerType } from "@rpg-engine/shared";
import { ItemContainerHelper } from "../ItemContainerHelper";

describe("ItemContainerHelper", () => {
  let itemContainerHelper: ItemContainerHelper;
  let testCharacter: ICharacter;
  let inventory: IItem;

  beforeAll(() => {
    itemContainerHelper = container.get<ItemContainerHelper>(ItemContainerHelper);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    inventory = await testCharacter.inventory;
  });

  describe("itemContainer type detection", () => {
    it("should properly detect an inventory itemContainer", async () => {
      const itemContainer = { parentItem: inventory.id } as IItemContainer;
      const result = await itemContainerHelper.getContainerType(itemContainer);
      expect(result).toBe(ItemContainerType.Inventory);
    });

    it("should properly detect a loot itemContainer", async () => {
      const blueprintData = itemsBlueprintIndex[BodiesBlueprint.CharacterBody];

      const charBody = await Item.create({
        ...blueprintData,
        owner: testCharacter.id,
        name: `${testCharacter.name}'s body`,
        scene: testCharacter.scene,
        x: testCharacter.x,
        y: testCharacter.y,
        generateContainerSlots: 20,
        isItemContainer: true,
      });

      const lootContainer = await ItemContainer.create({
        parentItem: charBody.id,
      });

      const type = await itemContainerHelper.getContainerType(lootContainer as unknown as IItemContainer);

      expect(type).toBe(ItemContainerType.Loot);
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

      const type = await itemContainerHelper.getContainerType(mapContainer as unknown as IItemContainer);

      expect(type).toBe(ItemContainerType.MapContainer);
    });
  });
});
