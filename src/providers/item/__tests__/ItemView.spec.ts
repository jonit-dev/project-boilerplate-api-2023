/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { ItemView } from "../ItemView";

describe("ItemView.ts", () => {
  let testCharacter: ICharacter;
  let testItem: IItem;
  let itemView: ItemView;
  let spyWarnCharactersAboutItemRemovalInView: any;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemView = container.get<ItemView>(ItemView);

    spyWarnCharactersAboutItemRemovalInView = jest.spyOn(itemView, "warnCharactersAboutItemRemovalInView" as any);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await unitTestHelper.createMockCharacter({
      x: FromGridX(0),
      y: FromGridY(0),
    });
    testItem = await unitTestHelper.createMockItem({
      x: FromGridX(0),
      y: FromGridY(0),
      scene: testCharacter.scene,
      isItemContainer: true,
    });
  });

  it("should properly remove item x, y and scene after calling the method removeItemFromMap", async () => {
    await itemView.removeItemFromMap(testItem);

    expect(spyWarnCharactersAboutItemRemovalInView).toHaveBeenCalled();

    expect(testItem.x).toBe(undefined);
    expect(testItem.y).toBe(undefined);
    expect(testItem.scene).toBe(undefined);
  });

  it("validate isEquipable, isStackable and fullDescription Item fields", () => {
    expect(testItem.isEquipable).toBeTruthy();
    expect(testItem.isStackable).toBeFalsy();
    expect(testItem.fullDescription).toBe(
      `${testItem.name}: Attack: ${testItem.attack}. Defense: ${testItem.defense}. Weight: ${testItem.weight}.`
    );
  });

  it("validate isEquipable, isStackable and fullDescription Item fields | stackable item", async () => {
    testItem = await unitTestHelper.createStackableMockItem({
      x: FromGridX(0),
      y: FromGridY(0),
      scene: testCharacter.scene,
    });

    expect(testItem.isEquipable).toBeTruthy();
    expect(testItem.isStackable).toBeTruthy();
    expect(testItem.fullDescription).toBe(`${testItem.name}: ${testItem.description}`);
  });

  it("validate post save() Item methods are properly executed | add itemContainer and slots ", async () => {
    expect(testItem.itemContainer).toBeDefined();

    const itemContainer = await ItemContainer.findById(testItem.itemContainer);

    expect(itemContainer).toBeDefined();
    expect(itemContainer!.slotQty).toBe(20);
    expect(itemContainer!.name).toBe(testItem.name);
    expect(itemContainer!.parentItem.toString()).toBe(testItem._id.toString());
    expect(itemContainer!.slots).toBeDefined();
  });

  it("validate post remove() Item methods are properly executed | call warnAboutItemChanges and remove itemContainer ", async () => {
    await testItem.remove();

    expect(spyWarnCharactersAboutItemRemovalInView).toHaveBeenCalled();

    expect(testItem.itemContainer).toBeDefined();

    const itemContainer = await ItemContainer.findById(testItem.itemContainer);
    const item = await Item.findById(testItem._id);

    expect(item).toBeNull();
    expect(itemContainer).toBeNull();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
