/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { characterWeight, container, unitTestHelper } from "@providers/inversify/container";
import { characterMock } from "@providers/unitTests/mock/characterMock";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { ItemDrop } from "../ItemDrop";
import { ItemView } from "../ItemView";

describe("ItemDrop.ts", () => {
  let itemDrop: ItemDrop;
  let itemView: ItemView;
  let testCharacter: ICharacter;
  let testItem: IItem;
  let inventory: IItem;
  let sendCustomErrorMessage: jest.SpyInstance;
  let inventoryItemContainerId: string;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemDrop = container.get<ItemDrop>(ItemDrop);
    itemView = container.get<ItemView>(ItemView);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await (
      await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true, hasSkills: true })
    )
      .populate("skills")
      .execPopulate();
    testItem = await unitTestHelper.createMockItem();
    inventory = await testCharacter.inventory;
    inventoryItemContainerId = inventory.itemContainer as unknown as string;
    const bag = await ItemContainer.findById(inventoryItemContainerId);

    // Adding item to inventory in order to drop it
    if (bag) {
      bag.slots[0] = testItem;
      await ItemContainer.updateOne(
        {
          _id: bag.id,
        },
        {
          $set: {
            slots: bag.slots,
          },
        }
      );
    }

    testCharacter.x = FromGridX(1);
    testCharacter.y = FromGridY(0);
    await testCharacter.save();
    await testItem.save();

    sendCustomErrorMessage = jest.spyOn(itemDrop, "sendCustomErrorMessage" as any);
  });

  const dropItem = async (fromContainerId: string, extraProps?: Record<string, unknown>) => {
    const itemDropped = await itemDrop.performItemDrop(
      {
        itemId: testItem.id,
        scene: testCharacter.scene,
        x: testCharacter.x,
        y: testCharacter.y,
        toPosition: { x: testCharacter.x, y: testCharacter.y, scene: testCharacter.scene },
        fromContainerId,
        ...extraProps,
      },
      testCharacter
    );
    return itemDropped;
  };

  it("should drop item from character inventory", async () => {
    const itemDropped = await dropItem(inventoryItemContainerId);

    expect(itemDropped).toBeTruthy();
  });

  it("item should be created on the map after being dropped from the inventory", async () => {
    const mapItem = await unitTestHelper.createMockItem({
      x: testCharacter.x,
      y: testCharacter.y,
      scene: testCharacter.scene,
    });

    const drop = await dropItem(inventoryItemContainerId, { itemId: mapItem.id });

    expect(drop).toBeTruthy();

    const items = await itemView.getItemsInCharacterView(testCharacter);

    if (!items) {
      throw new Error("Failed to find item after drop!");
    }

    const droppedItem = items.filter((e) => {
      return e.id === testItem.id;
    });
    expect(droppedItem).toBeDefined();
  });

  it("should decrease character weight, after items are picked up", async () => {
    const currentWeight = await characterWeight.getWeight(testCharacter);
    const maxWeight = await characterWeight.getMaxWeight(testCharacter);
    expect(currentWeight).toBe(4);
    expect(maxWeight).toBe(15);

    const droppedItem = await dropItem(inventoryItemContainerId);
    expect(droppedItem).toBeTruthy();

    const newWeight = await characterWeight.getWeight(testCharacter!);
    expect(newWeight).toBe(3);
    const newMaxWeight = await characterWeight.getMaxWeight(testCharacter!);
    expect(newMaxWeight).toBe(15);
  });

  describe("Item drop validation", () => {
    it("should throw an error if container is not accessible", async () => {
      const drop = await dropItem(inventoryItemContainerId, {
        itemId: "62b792030c3f470048781135", // inexistent item
      });
      expect(drop).toBeFalsy();

      expect(sendCustomErrorMessage).toHaveBeenCalledWith(testCharacter, "Sorry, this item is not accessible.");
    });

    it("should throw an error if the user tries to drop an item and is banned or not online", async () => {
      testCharacter.isBanned = true;
      await testCharacter.save();

      const drop = await dropItem(inventoryItemContainerId);
      expect(drop).toBeFalsy();

      expect(sendCustomErrorMessage).toHaveBeenCalledWith(
        testCharacter,
        "Sorry, you are banned and can't drop this item."
      );

      testCharacter.isBanned = false;
      testCharacter.isOnline = false;
      await testCharacter.save();

      const drop2 = await dropItem(inventoryItemContainerId);
      expect(drop2).toBeFalsy();

      expect(sendCustomErrorMessage).toHaveBeenCalledWith(
        testCharacter,
        "Sorry, you must be online to drop this item."
      );
    });

    it("should throw an error if the user tries to drop an item, without an inventory", async () => {
      const charEquip = await Equipment.findOne({ _id: testCharacter.equipment });

      if (charEquip) {
        charEquip.inventory = undefined;
        await charEquip.save();

        const drop = await dropItem(inventoryItemContainerId);
        expect(drop).toBeFalsy();

        expect(sendCustomErrorMessage).toHaveBeenCalledWith(
          testCharacter,
          "Sorry, you must have a bag or backpack to drop this item."
        );
      } else {
        throw new Error("Failed to remove character equipment!");
      }
    });
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
