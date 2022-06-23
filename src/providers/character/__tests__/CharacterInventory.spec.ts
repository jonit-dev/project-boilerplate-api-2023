/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterInventory } from "../CharacterInventory";

describe("CharacterInventory.ts", () => {
  let characterInventory: CharacterInventory;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    characterInventory = container.get<CharacterInventory>(CharacterInventory);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("should properly get the item in the inventory slot", async () => {
    await characterInventory.addEquipmentCharacter(testCharacter);

    const inventory = await testCharacter.inventory;

    expect(inventory.name).toBe("Short Sword");
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
