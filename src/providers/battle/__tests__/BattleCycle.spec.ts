import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { unitTestHelper } from "@providers/inversify/container";
import { BattleCycle } from "../BattleCycle";

jest.mock("@entities/ModuleCharacter/CharacterModel", () => {
  return {
    Character: {
      updateOne: jest.fn(),
    },
  };
});
let battleCycle: BattleCycle;
let id: string;
let fn: Function;
let intervalSpeed: number;

describe("BattleCycle", () => {
  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });
  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    id = "123";
    fn = jest.fn();
    intervalSpeed = 1000;
    battleCycle = new BattleCycle(id, fn, intervalSpeed);
  });
  afterEach(() => {
    // Create a mock function for the clearAllMocks function
    jest.clearAllMocks();
  });
  afterAll(async () => {
    // Create a mock function for the afterAllJestHook function
    await unitTestHelper.afterAllJestHook();
  });

  it("creates a new battle cycle and stores it in the battleCycles map", () => {
    expect(BattleCycle.battleCycles.has(id)).toBe(true);
    expect(BattleCycle.battleCycles.get(id)).toEqual(battleCycle);
  });

  it("clears an interval and removes it from the battleCycles map", async () => {
    await battleCycle.clear();

    expect(BattleCycle.battleCycles.has(id)).toBe(false);
  });

  it("updates the target property on a character document in the database when the interval is cleared", async () => {
    await battleCycle.clear();

    expect(Character.updateOne).toHaveBeenCalledWith({ _id: id }, { $unset: { target: 1 } });
  });
});
