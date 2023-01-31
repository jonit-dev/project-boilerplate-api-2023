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
  beforeAll(() => {
    jest.useFakeTimers({
      advanceTimers: true,
    });
  });

  beforeEach(() => {
    id = "6233ff328f3b09002fe32f9b";
    fn = jest.fn();
    intervalSpeed = 1000;
    battleCycle = new BattleCycle(id, fn, intervalSpeed);
  });
  afterEach(() => {
    // Create a mock function for the clearAllMocks function
    jest.clearAllMocks();
  });

  it("creates a new battle cycle and stores it in the battleCycles map", () => {
    expect(BattleCycle.battleCycles.has(id)).toBe(true);
    expect(BattleCycle.battleCycles.get(id)).toEqual(battleCycle);
  });

  it("clears an interval and removes it from the battleCycles map", async () => {
    await battleCycle.clear();

    expect(BattleCycle.battleCycles.has(id)).toBe(false);
  });
});
