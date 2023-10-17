import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { ItemSubType } from "@rpg-engine/shared";
import { CharacterConsumptionControl } from "../CharacterConsumptionControl";

describe("CharacterConsumptionControl", () => {
  let characterConsumptionControl: CharacterConsumptionControl;

  beforeAll(() => {
    characterConsumptionControl = container.get(CharacterConsumptionControl);

    jest.useFakeTimers({
      advanceTimers: true,
    });
  });

  afterEach(async () => {
    await characterConsumptionControl.clearAllItemConsumption();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should allow consumption if the character is not full", async () => {
    const character = { _id: "testCharacterId" } as ICharacter;
    const itemType = ItemSubType.Food;

    const result = await characterConsumptionControl.tryConsuming(character, itemType);

    expect(result).toBe(true);
  });

  it("should block consumption if the character is full", async () => {
    const character = { _id: "testCharacterId" } as ICharacter;
    const itemType = ItemSubType.Food;

    for (let i = 0; i < 10; i++) {
      // @ts-ignore
      await characterConsumptionControl.consumeItem(character._id, itemType);
    }

    const result = await characterConsumptionControl.tryConsuming(character, itemType);

    expect(result).toBe(false);
  });

  it("should handle different item types", async () => {
    const character = { _id: "testCharacterId" } as ICharacter;

    expect(await characterConsumptionControl.tryConsuming(character, ItemSubType.Food)).toBe(true);
    expect(await characterConsumptionControl.tryConsuming(character, ItemSubType.Potion)).toBe(true);
  });

  it("should reset consumption count after timeout", async () => {
    const character = { _id: "testCharacterId" } as ICharacter;
    const itemType = ItemSubType.Food;

    // @ts-ignore
    await characterConsumptionControl.consumeItem(character._id, itemType);

    // Fast-forward until all timers have been executed
    jest.runAllTimers();

    const result = await characterConsumptionControl.tryConsuming(character, itemType);
    expect(result).toBe(true);
  });

  it("should clear all consumption", async () => {
    const character = { _id: "testCharacterId" } as ICharacter;
    const itemType = ItemSubType.Food;

    // @ts-ignore
    await characterConsumptionControl.consumeItem(character._id, itemType);

    await characterConsumptionControl.clearAllItemConsumption();

    const result = await characterConsumptionControl.tryConsuming(character, itemType);
    expect(result).toBe(true);
  });

  it("should allow consumption if no consumption data is found", async () => {
    const character = { _id: "testCharacterId" } as ICharacter;
    const itemType = "none" as ItemSubType; // Assuming ItemSubType.Unknown is not in your consumptionCleanInterval

    const result = await characterConsumptionControl.tryConsuming(character, itemType);

    expect(result).toBe(true);
  });
});
