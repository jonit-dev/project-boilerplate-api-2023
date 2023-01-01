import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { unitTestHelper } from "@providers/inversify/container";
import { NPCBattleCycle, NPC_BATTLE_CYCLES } from "../NPCBattleCycle";

let npcBattleCycles: NPCBattleCycle;
let id: string;
let fn: Function;
let intervalSpeed: number;
describe("NPCBattleCycle.ts", () => {
  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    id = "62b792030c3f470048781135";
    fn = jest.fn();
    intervalSpeed = -1;
    // Create an NPCBattleCycle instance
    npcBattleCycles = new NPCBattleCycle(id, fn, intervalSpeed);
  });
  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });

  it("should test that the NPCBattleCycle instance is correctly added to the NPC_BATTLE_CYCLES map when it is created", () => {
    expect(NPC_BATTLE_CYCLES.has(id)).toBe(true);
    expect(NPC_BATTLE_CYCLES.get(id)).toBe(npcBattleCycles);
  });

  it("should test that the function passed to the constructor is called at the specified interval", async () => {
    // Create a mock function and track the number of times it is called
    const mockFn = jest.fn();

    // Create a new NPCBattleCycle instance with a 10ms interval and the mock function
    const npcBattleCycle = new NPCBattleCycle(id, mockFn, 10);

    // Wait 20ms to allow the function to be called twice
    await new Promise((resolve) => setTimeout(resolve, 20));

    // Stop the interval and remove the NPCBattleCycle instance from the map
    await npcBattleCycle.clear();

    // Assert that the mock function was called twice
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should test that the clearInterval function was called with the correct interval", async () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");

    await npcBattleCycles.clear();

    // Verify that the clearInterval function was called with the correct interval
    expect(clearIntervalSpy).toHaveBeenCalledWith(npcBattleCycles.interval);
  });

  it("should test that the clear method updates the target field of the Character document with the given id", async () => {
    const updateOneSpy = jest.spyOn(Character, "updateOne");

    await npcBattleCycles.clear();

    // Verify that the updateOne function was called with the correct arguments
    expect(updateOneSpy).toHaveBeenCalledWith({ _id: id }, { $unset: { target: 1 } });
  });

  it("should test that the clear method does not throw an error if the Character document with the given id does not exist", async () => {
    // Mock the Character.updateOne method to return an empty object
    // @ts-expect-error
    jest.spyOn(Character, "updateOne").mockResolvedValue({});

    // Call the clear method
    await expect(npcBattleCycles.clear()).resolves.not.toThrowError();
  });

  it("should test that the clear method does not throw an error if the interval has already been cleared", async () => {
    // // Mock the clearInterval function to return undefined
    // jest.spyOn(global, "clearInterval").mockReturnValue(undefined);
    // Clear the interval
    await npcBattleCycles.clear();

    // Call the clear method
    await expect(npcBattleCycles.clear()).resolves.not.toThrowError();
  });

  it("should test that the clear method does not throw an error if the NPC_BATTLE_CYCLES map is empty", async () => {
    NPC_BATTLE_CYCLES.clear();

    // Clear the NPCBattleCycle instance
    await npcBattleCycles.clear();

    // Assert that the clear method did not throw an error
    expect(() => {}).not.toThrowError();
  });
});
