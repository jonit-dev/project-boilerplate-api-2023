import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterClass } from "@rpg-engine/shared";
import { ManaDrain } from "../ManaDrain";

describe("Mana Drain", () => {
  let attacker: ICharacter;
  let target: ICharacter;
  let manaDrain: ManaDrain;

  beforeAll(() => {
    manaDrain = container.get<ManaDrain>(ManaDrain);
  });

  beforeEach(async () => {
    attacker = await unitTestHelper.createMockCharacter(
      {
        mana: 100,
        health: 100,
        class: CharacterClass.Sorcerer,
      },
      {
        hasSkills: true,
      }
    );

    target = await unitTestHelper.createMockCharacter(
      {
        mana: 100,
        health: 100,
        class: CharacterClass.Sorcerer,
      },
      {
        hasSkills: true,
      }
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("should drain mana correctly", async () => {
    const result = await manaDrain.handleManaDrain(attacker, target);

    expect(result).toBe(true);
    expect(attacker.mana).toBeLessThanOrEqual(attacker.maxMana);
    expect(target.mana).toBeGreaterThanOrEqual(0);
  });

  it("should not drain mana if attacker is the same as target", async () => {
    const result = await manaDrain.handleManaDrain(attacker, attacker);

    expect(result).toBe(false);
    expect(attacker.mana).toBe(100);
  });

  it("should not drain mana if target has no mana", async () => {
    target.mana = 0;

    const result = await manaDrain.handleManaDrain(attacker, target);

    expect(result).toBe(false);
    expect(attacker.mana).toBe(100);
    expect(target.mana).toBe(0);
  });

  it("should drain only the available mana if it is less than the calculated drain amount", async () => {
    target.mana = 20;
    attacker.mana = 50;

    const result = await manaDrain.handleManaDrain(attacker, target);

    expect(result).toBe(true);
    expect(attacker.mana).toBe(55);
    expect(target.mana).toBe(15);
  });

  it("should not increase attacker's mana if it is already at max", async () => {
    attacker.mana = attacker.maxMana;

    const result = await manaDrain.handleManaDrain(attacker, target);

    expect(result).toBe(true);
    expect(attacker.mana).toBe(attacker.maxMana);
  });

  it("should not increase attacker's mana above its max", async () => {
    attacker.mana = attacker.maxMana - 2;

    const result = await manaDrain.handleManaDrain(attacker, target);

    expect(result).toBe(true);
    expect(attacker.mana).toBe(attacker.maxMana);
  });

  it("should handle errors correctly", async () => {
    const mockError = new Error("Test error");

    // @ts-ignore
    manaDrain.calculateManaDrained = jest.fn().mockImplementation(() => {
      throw mockError;
    });

    const spy = jest.spyOn(console, "error").mockImplementation();

    const result = await manaDrain.handleManaDrain(attacker, target);

    expect(spy).toHaveBeenCalledWith(`Failed to handle sorcerer mana drain: ${mockError}`);

    expect(result).toBe(false);

    spy.mockRestore();
  });
});
