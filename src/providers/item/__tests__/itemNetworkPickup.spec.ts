/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { ItemNetworkPickup } from "../network/ItemNetworkPickup";

describe("ItemNetworkPickup.ts", () => {
  let itemNetworkPickup: ItemNetworkPickup;
  let testCharacter: ICharacter;
  let testItem: IItem;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemNetworkPickup = container.get<ItemNetworkPickup>(ItemNetworkPickup);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    testItem = await unitTestHelper.createMockItem();

    testCharacter.x = FromGridX(1);
    testCharacter.y = FromGridY(0);
    await testCharacter.save();
    await testItem.save();
  });

  it("should add item to character inventory", async () => {
    const itemAdded = await itemNetworkPickup.addItemToInventory(testItem, testCharacter);

    expect(itemAdded).toBeTruthy();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
