import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterSpellLifeSteal } from "../CharacterSpellLifeSteal";

describe("CharacterSpellLifeSteal", () => {
  let characterSpellLifeSteal: CharacterSpellLifeSteal;
  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(() => {
    characterSpellLifeSteal = container.get(CharacterSpellLifeSteal);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC();
    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("casts life steal from a CHARACTER to a CHARACTER", async () => {
    testCharacter.health = 50;
    testCharacter.maxHealth = 100;
    await testCharacter.save();

    const anotherCharacter = await unitTestHelper.createMockCharacter();

    // @ts-ignore
    jest.spyOn(characterSpellLifeSteal, "calculatePotentialLifeSteal").mockImplementation(() => 10);

    await characterSpellLifeSteal.performLifeSteal(testCharacter, anotherCharacter);

    const updatedTestCharacterHealth = (await Character.findById(testCharacter._id)
      .lean()
      .select("health")) as ICharacter;

    expect(updatedTestCharacterHealth.health).toBe(60);

    const updatedAnotherCharacterHealth = (await Character.findById(anotherCharacter._id)
      .lean()
      .select("health")) as ICharacter;

    expect(updatedAnotherCharacterHealth.health).toBe(90);
  });

  it("properly casts life steal from a CHARACTER to a NPC", async () => {
    testCharacter.health = 50;
    testCharacter.maxHealth = 100;
    await testCharacter.save();

    // @ts-ignore
    jest.spyOn(characterSpellLifeSteal, "calculatePotentialLifeSteal").mockImplementation(() => 10);

    await characterSpellLifeSteal.performLifeSteal(testCharacter, testNPC);

    const updatedTestCharacterHealth = (await Character.findById(testCharacter._id)
      .lean()
      .select("health")) as ICharacter;

    expect(updatedTestCharacterHealth.health).toBe(60);

    const updatedTestNPCHealth = (await NPC.findById(testNPC._id).lean().select("health")) as INPC;

    expect(updatedTestNPCHealth.health).toBe(90);
  });

  describe("Edge cases", () => {
    it("avoids maxHealth overflow", async () => {
      testCharacter.health = 99;
      testCharacter.maxHealth = 100;
      await testCharacter.save();

      // @ts-ignore
      jest.spyOn(characterSpellLifeSteal, "calculatePotentialLifeSteal").mockImplementation(() => 9999);

      await characterSpellLifeSteal.performLifeSteal(testCharacter, testNPC);

      const updatedTestCharacterHealth = (await Character.findById(testCharacter._id)
        .lean()
        .select("health")) as ICharacter;

      expect(updatedTestCharacterHealth.health).toBe(100);
    });
  });
});
