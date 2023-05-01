import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { BuffType, CharacterAttributes, ICharacterTemporaryBuff } from "@rpg-engine/shared";
import { CharacterBuffAttribute } from "../CharacterBuffAttribute";

describe("CharacterBuffAttribute", () => {
  let characterBuffAttribute: CharacterBuffAttribute;
  let testCharacter: ICharacter;

  beforeAll(() => {
    characterBuffAttribute = container.get(CharacterBuffAttribute);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter();
  });

  const createTestBuff = (character: ICharacter): ICharacterTemporaryBuff => {
    return {
      type: "characterAttribute" as BuffType,
      trait: CharacterAttributes.Speed,
      buffPercentage: 10,
      durationSeconds: 3600,
      durationType: "temporary",
      prevTraitValue: character[CharacterAttributes.Speed],
    };
  };

  it("should enable a buff and update character attribute", async () => {
    const testBuff = createTestBuff(testCharacter);
    const prevTraitValue = testCharacter[testBuff.trait];

    await characterBuffAttribute.enableBuff(testCharacter, testBuff);

    const updatedCharacter = await Character.findById(testCharacter._id!);

    if (!updatedCharacter) throw new Error("Character not found");

    const updatedTraitValue = updatedCharacter[testBuff.trait];

    expect(updatedTraitValue).toBe(prevTraitValue + prevTraitValue * (testBuff.buffPercentage / 100));
  });

  it("should disable a buff and rollback character attribute to the previous value", async () => {
    const testBuff = createTestBuff(testCharacter);
    const prevTraitValue = testCharacter[testBuff.trait];

    const buffId = await characterBuffAttribute.enableBuff(testCharacter, testBuff);

    await characterBuffAttribute.disableBuff(testCharacter, buffId);

    const updatedCharacter = await Character.findById(testCharacter._id!);

    if (!updatedCharacter) throw new Error("Character not found");

    const updatedTraitValue = updatedCharacter[testBuff.trait];

    expect(updatedTraitValue).toBe(prevTraitValue);
  });
});
