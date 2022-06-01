/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterDeath } from "../CharacterDeath";

describe("CharacterDeath.ts", () => {
  let characterDeath: CharacterDeath;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    characterDeath = container.get<CharacterDeath>(CharacterDeath);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("should properly generate a character body on death", async () => {
    await characterDeath.handleCharacterDeath(testCharacter);

    const charBody = await Item.findOne({
      owner: testCharacter._id,
    });

    expect(charBody).toBeDefined();
  });

  it("should respawn a character after its death", async () => {
    await characterDeath.handleCharacterDeath(testCharacter);

    expect(testCharacter.health === testCharacter.maxHealth).toBeTruthy();
    expect(testCharacter.mana === testCharacter.maxMana).toBeTruthy();
    expect(testCharacter.x === testCharacter.initialX).toBeTruthy();
    expect(testCharacter.y === testCharacter.initialY).toBeTruthy();
    expect(testCharacter.scene === testCharacter.initialScene).toBeTruthy();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
