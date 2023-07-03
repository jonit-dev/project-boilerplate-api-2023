import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { BasicAttribute, CharacterBuffDurationType, ICharacterItemBuff } from "@rpg-engine/shared";
import { CharacterBuffActivator } from "../CharacterBuffActivator";
import { CharacterBuffTracker } from "../CharacterBuffTracker";
import { CharacterBuffValidation } from "../CharacterBuffValidation";

describe("CharacterBuffValidation", () => {
  let characterBuffValidation: CharacterBuffValidation;
  let characterBuffActivator: CharacterBuffActivator;
  let characterBuffTracker: CharacterBuffTracker;
  let testCharacter: ICharacter;

  beforeAll(() => {
    characterBuffValidation = container.get(CharacterBuffValidation);
    characterBuffActivator = container.get(CharacterBuffActivator);
    characterBuffTracker = container.get(CharacterBuffTracker);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasSkills: true });
  });

  it("should remove duplicate buffs for the same item", async () => {
    const buff = {
      type: "skill",
      trait: BasicAttribute.Strength, // Replace with a valid skill trait from your implementation
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      itemId: "123",
    } as ICharacterItemBuff;

    await characterBuffActivator.enablePermanentBuff(testCharacter, buff);
    await characterBuffActivator.enablePermanentBuff(testCharacter, buff);

    await characterBuffValidation.removeDuplicatedBuffs(testCharacter);

    const updatedBuffs = await characterBuffTracker.getAllCharacterBuffs(testCharacter._id);

    expect(updatedBuffs.length).toBe(1);
  });

  it("should not modify anything when character has non-duplicate buffs", async () => {
    const buff1 = {
      // different buff details...
      itemId: "123",
    } as ICharacterItemBuff;
    const buff2 = {
      // different buff details...
      itemId: "456",
    } as ICharacterItemBuff;

    await characterBuffActivator.enablePermanentBuff(testCharacter, buff1);
    await characterBuffActivator.enablePermanentBuff(testCharacter, buff2);

    const originalBuffs = await characterBuffTracker.getAllCharacterBuffs(testCharacter._id);

    await characterBuffValidation.removeDuplicatedBuffs(testCharacter);

    const updatedBuffs = await characterBuffTracker.getAllCharacterBuffs(testCharacter._id);

    expect(updatedBuffs).toEqual(originalBuffs);
  });

  describe("Edge cases", () => {
    it("should not modify anything when character has no buffs", async () => {
      const updatedBuffs = await characterBuffTracker.getAllCharacterBuffs(testCharacter._id);

      expect(updatedBuffs).toEqual([]);

      await characterBuffValidation.removeDuplicatedBuffs(testCharacter);

      const updatedBuffsAfter = await characterBuffTracker.getAllCharacterBuffs(testCharacter._id);

      expect(updatedBuffsAfter).toEqual(updatedBuffs);
    });
    it("should keep only the strongest buff when character has multiple duplicate buffs of varying strengths", async () => {
      const weakBuff = {
        type: "skill",
        trait: BasicAttribute.Strength, // Replace with a valid skill trait from your implementation
        buffPercentage: 10,
        durationType: CharacterBuffDurationType.Permanent,
        itemId: "123",
      } as ICharacterItemBuff;
      const strongBuff = {
        type: "skill",
        trait: BasicAttribute.Strength, // Replace with a valid skill trait from your implementation
        buffPercentage: 50,
        durationType: CharacterBuffDurationType.Permanent,
        itemId: "123",
      } as ICharacterItemBuff;

      await characterBuffActivator.enablePermanentBuff(testCharacter, weakBuff);
      await characterBuffActivator.enablePermanentBuff(testCharacter, strongBuff);

      await characterBuffValidation.removeDuplicatedBuffs(testCharacter);

      const updatedBuffs = await characterBuffTracker.getAllCharacterBuffs(testCharacter._id);

      expect(updatedBuffs.length).toBe(1);
      expect(updatedBuffs[0]).toMatchObject(
        expect.objectContaining({
          buffPercentage: 50,
        })
      );
    });
  });
});
