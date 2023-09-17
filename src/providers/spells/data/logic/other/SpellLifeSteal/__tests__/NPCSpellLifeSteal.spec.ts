import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { NPCSpellLifeSteal } from "../NPCSpellLifeSteal";

describe("NPCSpellLifeSteal", () => {
  let npcSpellLifeSteal: NPCSpellLifeSteal;
  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(() => {
    npcSpellLifeSteal = container.get(NPCSpellLifeSteal);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC();
    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("properly casts life steal from a NPC to a character", async () => {
    testNPC.health = 50;
    testNPC.maxHealth = 100;
    await testNPC.save();

    // @ts-ignore
    jest.spyOn(npcSpellLifeSteal, "calculatePotentialLifeSteal").mockImplementation(() => 10);

    await npcSpellLifeSteal.performLifeSteal(testNPC, testCharacter);

    const updatedTestNPCHealth = (await NPC.findById(testNPC._id).lean().select("health")) as INPC;

    expect(updatedTestNPCHealth.health).toBe(60);

    const updatedTestCharacterHealth = (await Character.findById(testCharacter._id)
      .lean()
      .select("health")) as ICharacter;

    expect(updatedTestCharacterHealth.health).toBe(90);
  });

  describe("Edge cases", () => {
    it("avoids maxHealth overflow", async () => {
      testNPC.health = 99;
      testNPC.maxHealth = 100;
      await testNPC.save();

      // @ts-ignore
      jest.spyOn(npcSpellLifeSteal, "calculatePotentialLifeSteal").mockImplementation(() => 9999);

      await npcSpellLifeSteal.performLifeSteal(testNPC, testCharacter);

      const updatedTestNPCHealth = (await NPC.findById(testNPC._id).lean().select("health")) as INPC;

      expect(updatedTestNPCHealth.health).toBe(100);
    });
  });
});
