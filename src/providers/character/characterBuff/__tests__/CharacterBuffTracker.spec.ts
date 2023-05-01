import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import {
  BasicAttribute,
  BuffDurationType,
  BuffType,
  CharacterAttributes,
  ICharacterTemporaryBuff,
} from "@rpg-engine/shared";
import { CharacterBuffTracker } from "../CharacterBuffTracker";

describe("CharacterBuffTracker", () => {
  let characterBuffTracker: CharacterBuffTracker;
  let testCharacter: ICharacter;

  beforeAll(() => {
    characterBuffTracker = container.get(CharacterBuffTracker);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter();
  });

  afterEach(async () => {
    await characterBuffTracker.deleteAllCharacterBuffs(testCharacter);
  });

  const createTestBuff = (): ICharacterTemporaryBuff => {
    return {
      type: "combatSkill" as BuffType,
      trait: BasicAttribute.Strength,
      buffPercentage: 10,
      durationSeconds: 3600,
      durationType: "temporary",
    };
  };

  it("should add a buff to a character", async () => {
    const testBuff = createTestBuff();

    const result = await characterBuffTracker.addBuff(testCharacter, testBuff);

    expect(result).toBeTruthy();
  });

  it("should get a buff by ID", async () => {
    const testBuff = createTestBuff();

    await characterBuffTracker.addBuff(testCharacter, testBuff);

    const retrievedBuff = await characterBuffTracker.getBuff(testCharacter, testBuff._id!);

    expect(retrievedBuff).toBeDefined();
    expect(retrievedBuff).toEqual(testBuff);
  });

  it("should return undefined when getting a non-existent buff", async () => {
    const retrievedBuff = await characterBuffTracker.getBuff(testCharacter, "non-existent-id");

    expect(retrievedBuff).toBeUndefined();
  });

  it("should delete a buff by ID", async () => {
    const testBuff = createTestBuff();

    await characterBuffTracker.addBuff(testCharacter, testBuff);

    const result = await characterBuffTracker.deleteBuff(testCharacter, testBuff._id!);

    expect(result).toBeTruthy();

    const deletedBuff = await characterBuffTracker.getBuff(testCharacter, testBuff._id!);

    expect(deletedBuff).toBeUndefined();
  });

  it("should return false when deleting a non-existent buff", async () => {
    const result = await characterBuffTracker.deleteBuff(testCharacter, "non-existent-id");

    expect(result).toBeFalsy();
  });

  it("should delete all buffs for a character", async () => {
    const testBuff1 = createTestBuff();
    const testBuff2 = { ...createTestBuff(), trait: CharacterAttributes.MaxMana };

    await characterBuffTracker.addBuff(testCharacter, testBuff1);
    await characterBuffTracker.addBuff(testCharacter, testBuff2);

    const result = await characterBuffTracker.deleteAllCharacterBuffs(testCharacter);

    expect(result).toBeTruthy();

    const deletedBuff1 = await characterBuffTracker.getBuff(testCharacter, testBuff1._id!);
    const deletedBuff2 = await characterBuffTracker.getBuff(testCharacter, testBuff2._id!);

    expect(deletedBuff1).toBeUndefined();
    expect(deletedBuff2).toBeUndefined();
  });

  it("should get all character buffs", async () => {
    const testBuff1 = createTestBuff();
    const testBuff2 = { ...createTestBuff(), trait: CharacterAttributes.MaxMana };

    await characterBuffTracker.addBuff(testCharacter, testBuff1);
    await characterBuffTracker.addBuff(testCharacter, testBuff2);

    const allCharacterBuffs = await characterBuffTracker.getAllCharacterBuffs(testCharacter);

    expect(allCharacterBuffs.length).toEqual(2);
    expect(allCharacterBuffs).toContainEqual(testBuff1);
    expect(allCharacterBuffs).toContainEqual(testBuff2);
  });

  it("should return an empty array when getting buffs for a character with no buffs", async () => {
    const allCharacterBuffs = await characterBuffTracker.getAllCharacterBuffs(testCharacter);

    expect(allCharacterBuffs).toEqual([]);
  });

  it("should delete only temporary buffs for a character when specified", async () => {
    const testTemporaryBuff = createTestBuff();
    const testPermanentBuff = { ...createTestBuff(), durationType: "permanent" as BuffDurationType };

    await characterBuffTracker.addBuff(testCharacter, testTemporaryBuff);
    await characterBuffTracker.addBuff(testCharacter, testPermanentBuff);

    const result = await characterBuffTracker.deleteAllCharacterBuffs(testCharacter, { deleteTemporaryOnly: true });

    expect(result).toBeTruthy();

    const remainingBuffs = await characterBuffTracker.getAllCharacterBuffs(testCharacter);

    expect(remainingBuffs.length).toEqual(1);
    expect(remainingBuffs).toContainEqual(testPermanentBuff);
  });
});
