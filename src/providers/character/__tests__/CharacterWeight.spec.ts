import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterWeight } from "../CharacterWeight";
describe("CharacterWeight.ts", () => {
  let testCharacter: ICharacter;
  let characterWeight: CharacterWeight;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    characterWeight = container.get<CharacterWeight>(CharacterWeight);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
    });
  });

  it("should return the correct max weight", async () => {
    const maxWeight = await characterWeight.getMaxWeight(testCharacter);
    expect(maxWeight).toBe(60);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
