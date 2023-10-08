import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "../helper/ItemUsableEffect";

describe("ItemUsableEffect", () => {
  let itemUsableEffect: ItemUsableEffect;
  let testCharacter: ICharacter;
  let characterUpdateSpy: jest.SpyInstance;

  beforeAll(() => {
    itemUsableEffect = container.get(ItemUsableEffect);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter();
    testCharacter.health = 50;
    testCharacter.mana = 50;
    testCharacter.maxHealth = 100;
    testCharacter.maxMana = 100;
    await testCharacter.save();

    characterUpdateSpy = jest.spyOn(Character, "updateOne");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should correctly apply health effect on a character", async () => {
    await itemUsableEffect.apply(testCharacter, EffectableAttribute.Health, 25);
    expect(testCharacter.health).toBe(75);
    expect(characterUpdateSpy).toHaveBeenCalledWith({ _id: testCharacter._id }, { $set: { health: 75 } });
  });

  it("should not exceed max health for a character", async () => {
    await itemUsableEffect.apply(testCharacter, EffectableAttribute.Health, 200);
    expect(testCharacter.health).toBe(100);
    expect(characterUpdateSpy).toHaveBeenCalledWith({ _id: testCharacter._id }, { $set: { health: 100 } });
  });

  it("should correctly apply mana effect on a character", async () => {
    await itemUsableEffect.apply(testCharacter, EffectableAttribute.Mana, 25);
    expect(testCharacter.mana).toBe(75);
    expect(characterUpdateSpy).toHaveBeenCalledWith({ _id: testCharacter._id }, { $set: { mana: 75 } });
  });

  it("should not exceed max mana for a character", async () => {
    await itemUsableEffect.apply(testCharacter, EffectableAttribute.Mana, 200);
    expect(testCharacter.mana).toBe(100);
    expect(characterUpdateSpy).toHaveBeenCalledWith({ _id: testCharacter._id }, { $set: { mana: 100 } });
  });

  it("should correctly apply speed effect on a character with Slow speed", async () => {
    // Setting initial state
    testCharacter.baseSpeed = MovementSpeed.Slow;

    const newSpeedValue = MovementSpeed.ExtraFast;
    await itemUsableEffect.apply(testCharacter, EffectableAttribute.Speed, newSpeedValue);

    expect(testCharacter.baseSpeed).toBe(newSpeedValue);
    expect(characterUpdateSpy).toHaveBeenCalledWith({ _id: testCharacter._id }, { $set: { baseSpeed: newSpeedValue } });
  });

  it("should correctly apply speed effect on a character with ExtraSlow speed", async () => {
    testCharacter.baseSpeed = MovementSpeed.ExtraSlow;

    const newSpeedValue = MovementSpeed.ExtraFast;
    await itemUsableEffect.apply(testCharacter, EffectableAttribute.Speed, newSpeedValue);

    expect(testCharacter.baseSpeed).toBe(newSpeedValue);
    expect(characterUpdateSpy).toHaveBeenCalledWith({ _id: testCharacter._id }, { $set: { baseSpeed: newSpeedValue } });
  });

  it("should not change speed for characters with speeds other than Slow or ExtraSlow", async () => {
    // Setting initial state
    testCharacter.baseSpeed = MovementSpeed.Fast;

    const originalSpeed = testCharacter.baseSpeed;
    const newSpeedValue = MovementSpeed.ExtraFast;
    await itemUsableEffect.apply(testCharacter, EffectableAttribute.Speed, newSpeedValue);

    expect(testCharacter.baseSpeed).toBe(originalSpeed);
    // Ensure that the update method wasn't called for a change in speed
    expect(characterUpdateSpy).not.toHaveBeenCalledWith(
      { _id: testCharacter._id },
      { $set: { baseSpeed: newSpeedValue } }
    );
  });

  it("should correctly apply eating effect on a character's health", async () => {
    await itemUsableEffect.applyEatingEffect(testCharacter, 25);
    expect(testCharacter.health).toBe(75);
    expect(characterUpdateSpy).toHaveBeenCalledWith({ _id: testCharacter._id }, { $set: { health: 75 } });
  });

  it("should correctly apply eating effect on a character's mana", async () => {
    await itemUsableEffect.applyEatingEffect(testCharacter, 25);
    expect(testCharacter.mana).toBe(75);
    expect(characterUpdateSpy).toHaveBeenCalledWith({ _id: testCharacter._id }, { $set: { mana: 75 } });
  });

  it("should not exceed max health for a character on eating", async () => {
    await itemUsableEffect.applyEatingEffect(testCharacter, 200);
    expect(testCharacter.health).toBe(100);
    expect(characterUpdateSpy).toHaveBeenCalledWith({ _id: testCharacter._id }, { $set: { health: 100 } });
  });

  it("should not exceed max mana for a character on eating", async () => {
    await itemUsableEffect.applyEatingEffect(testCharacter, 200);
    expect(testCharacter.mana).toBe(100);
    expect(characterUpdateSpy).toHaveBeenCalledWith({ _id: testCharacter._id }, { $set: { mana: 100 } });
  });
});
