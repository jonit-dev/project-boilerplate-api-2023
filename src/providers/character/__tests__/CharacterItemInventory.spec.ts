import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterItemInventory } from "../characterItems/CharacterItemInventory";

describe("CharacterItemInventory.ts", () => {
  let characterItemInventory: CharacterItemInventory;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    characterItemInventory = container.get<CharacterItemInventory>(CharacterItemInventory);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("should properly get the item in the inventory slot", async () => {
    await characterItemInventory.addEquipmentToCharacter(testCharacter);

    const inventory = await testCharacter.inventory;

    expect(inventory.name).toBe("Backpack");
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
