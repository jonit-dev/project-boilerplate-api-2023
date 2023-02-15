import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterInventory } from "../CharacterInventory";

describe("CharacterInventory", () => {
  let testCharacter: ICharacter;
  let characterInventory: CharacterInventory;

  beforeAll(() => {
    characterInventory = container.get(CharacterInventory);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
  });

  it("fetches the inventory of a character", async () => {
    const inventory = await characterInventory.getInventory(testCharacter);

    expect(inventory).toBeDefined();
    expect(inventory.owner).toEqual(testCharacter._id);
    expect(inventory.isItemContainer).toBeTruthy();
  });
});
