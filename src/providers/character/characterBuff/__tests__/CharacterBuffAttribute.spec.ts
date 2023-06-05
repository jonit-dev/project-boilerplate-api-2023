import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import {
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  ICharacterTemporaryBuff,
} from "@rpg-engine/shared";
import { CharacterBuffAttribute } from "../CharacterBuffAttribute";
import { CharacterBuffTracker } from "../CharacterBuffTracker";

const createTestBuff = (character: ICharacter): Partial<ICharacterTemporaryBuff> => {
  return {
    type: CharacterBuffType.CharacterAttribute,
    trait: CharacterAttributes.Speed,
    buffPercentage: 10,
    durationSeconds: 3600,
    durationType: CharacterBuffDurationType.Temporary,
  };
};

describe("CharacterBuffAttribute", () => {
  let characterBuffAttribute: CharacterBuffAttribute;

  let characterBuffTracker: CharacterBuffTracker;
  let testCharacter: ICharacter;

  beforeAll(() => {
    characterBuffAttribute = container.get(CharacterBuffAttribute);
    characterBuffTracker = container.get(CharacterBuffTracker);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("should enable a buff and update character attribute", async () => {
    const testBuff = createTestBuff(testCharacter) as ICharacterTemporaryBuff;

    await characterBuffAttribute.enableBuff(testCharacter, testBuff);

    const updatedCharacter = await Character.findById(testCharacter._id!);

    const buffedSpeed = updatedCharacter?.baseSpeed;

    expect(buffedSpeed).toBe(2.64);

    if (!updatedCharacter) throw new Error("Character not found");

    const updatedTraitValue = updatedCharacter[testBuff.trait];

    expect(updatedTraitValue).toBe(testCharacter[testBuff.trait] * (1 + testBuff.buffPercentage / 100));
  });

  it("should disable a buff and rollback character attribute to the previous value", async () => {
    const testBuff = createTestBuff(testCharacter) as ICharacterTemporaryBuff;

    const enabledBuff = await characterBuffAttribute.enableBuff(testCharacter, testBuff);

    testCharacter = (await Character.findById(testCharacter._id!)) as ICharacter;

    expect(testCharacter.baseSpeed).toBe(2.64); // first 10% buff

    const hasDisabledBuff = await characterBuffAttribute.disableBuff(testCharacter, enabledBuff._id!);

    expect(hasDisabledBuff).toBeTruthy();

    testCharacter = (await Character.findById(testCharacter._id!)) as ICharacter;

    expect(testCharacter.baseSpeed).toBe(2.4); // original value
  });

  it("should handle multiple buffs and debuff them gradually", async () => {
    const testBuff1 = createTestBuff(testCharacter) as ICharacterTemporaryBuff;
    const testBuff2 = createTestBuff(testCharacter) as ICharacterTemporaryBuff;

    // Apply 2 buffs at once
    const enabledBuff1 = await characterBuffAttribute.enableBuff(testCharacter, testBuff1);
    const enabledBuff2 = await characterBuffAttribute.enableBuff(testCharacter, testBuff2);

    const allBuffs = await characterBuffTracker.getAllCharacterBuffs(testCharacter);
    const buffQty = allBuffs.length;

    let updatedCharacter = (await Character.findById(testCharacter._id!).lean()) as ICharacter;

    expect(buffQty).toBe(2);

    expect(updatedCharacter?.baseSpeed).toBe(2.88); // 2.4 + 20% = 2.88

    // now lets disable the first buff

    await characterBuffAttribute.disableBuff(updatedCharacter, enabledBuff1._id!);

    updatedCharacter = (await Character.findById(testCharacter._id!).lean()) as ICharacter;

    const buffedSpeed = updatedCharacter?.baseSpeed;

    expect(buffedSpeed).toBe(2.64); // 2.88 - 0.24 = 2.64

    // finally, disable the last buff

    await characterBuffAttribute.disableBuff(updatedCharacter, enabledBuff2._id!);

    updatedCharacter = (await Character.findById(testCharacter._id!).lean()) as ICharacter;

    const finalSpeed = updatedCharacter?.baseSpeed;

    expect(finalSpeed).toBe(2.4); // 2.64 - 0.24 = 2.4
  });
  it("should update health and mana if they are greater than maxHealth and maxMana after disabling a buff", async () => {
    // Create a buff that increases health and mana
    const healthBuff = {
      ...createTestBuff(testCharacter),
      trait: CharacterAttributes.MaxHealth,
      absoluteChange: 50,
    } as ICharacterTemporaryBuff;

    const manaBuff = {
      ...createTestBuff(testCharacter),
      trait: CharacterAttributes.MaxMana,
      absoluteChange: 50,
    } as ICharacterTemporaryBuff;

    // Enable the buffs
    const enabledHealthBuff = await characterBuffAttribute.enableBuff(testCharacter, healthBuff);
    const enabledManaBuff = await characterBuffAttribute.enableBuff(testCharacter, manaBuff);

    // Update character's health and mana to be more than maxHealth and maxMana
    await Character.updateOne(
      { _id: testCharacter._id },
      {
        health: testCharacter.maxHealth + 100,
        mana: testCharacter.maxMana + 100,
      }
    );

    testCharacter = (await Character.findById(testCharacter._id!)) as ICharacter;

    expect(testCharacter.health).toBeGreaterThan(testCharacter.maxHealth);
    expect(testCharacter.mana).toBeGreaterThan(testCharacter.maxMana);

    // Disable the buffs
    await characterBuffAttribute.disableBuff(testCharacter, enabledHealthBuff._id!);
    await characterBuffAttribute.disableBuff(testCharacter, enabledManaBuff._id!);

    testCharacter = (await Character.findById(testCharacter._id!)) as ICharacter;

    // Expect character's health and mana to be equal to maxHealth and maxMana
    expect(testCharacter.health).toBe(testCharacter.maxHealth);
    expect(testCharacter.mana).toBe(testCharacter.maxMana);
  });
});
