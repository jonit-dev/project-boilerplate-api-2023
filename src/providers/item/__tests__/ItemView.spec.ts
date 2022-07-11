/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { ItemView } from "../ItemView";

describe("ItemView.ts", () => {
  let testCharacter: ICharacter;
  let testItem: IItem;
  let itemView: ItemView;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemView = container.get<ItemView>(ItemView);
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
    });
  });

  it("should properly remove item x, y and scene after calling the method removeItemFromMap", async () => {
    await itemView.removeItemFromMap(testItem);

    expect(testItem.x).toBe(undefined);
    expect(testItem.y).toBe(undefined);
    expect(testItem.scene).toBe(undefined);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
