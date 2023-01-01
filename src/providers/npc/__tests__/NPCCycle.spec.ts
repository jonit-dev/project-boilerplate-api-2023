import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { unitTestHelper } from "@providers/inversify/container";
import { NPCCycle } from "../NPCCycle";

let npcCycle: NPCCycle;
let id: string;
let fn: Function;
let intervalSpeed: number;
describe("NPCCycle.ts", () => {
  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    id = "62b792030c3f470048781135";
    fn = jest.fn();
    intervalSpeed = -1;

    // Create an NPCCycle instance
    npcCycle = new NPCCycle(id, fn, intervalSpeed);
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

  it("should add the NPCCycle instance to the npcCycles map when it is created", (done) => {
    jest.runAllTimers();
    expect(NPCCycle.npcCycles.get(id)).toEqual(npcCycle);
    done();
  });

  it("should test that the clear method removes the NPCCycle instance from the npcCycles map and clears the interval", async () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");

    await npcCycle.clear();

    // Verify that the clearInterval function was called with the correct interval
    expect(clearIntervalSpy).toHaveBeenCalledWith(npcCycle.interval);

    // Verify that the npcCycle instance was removed from the npcCycles map
    expect(NPCCycle.npcCycles.has(id)).toBe(false);
  });

  it("should test that the clear method updates the target field of the Character document with the given id", async () => {
    const updateOneSpy = jest.spyOn(Character, "updateOne");

    await npcCycle.clear();

    // Verify that the updateOne function was called with the correct arguments
    expect(updateOneSpy).toHaveBeenCalledWith({ _id: id }, { $unset: { target: 1 } });
  });

  it("should test that the clear method does not throw an error if the Character document with the given id does not exist", async () => {
    // Mock the Character.updateOne method to return an empty object
    // @ts-expect-error
    jest.spyOn(Character, "updateOne").mockResolvedValue({});

    // Call the clear method
    await expect(npcCycle.clear()).resolves.not.toThrowError();
  });

  it("should test that the clear method does not throw an error if the interval has already been cleared", async () => {
    // Mock the clearInterval function to return undefined
    jest.spyOn(global, "clearInterval").mockReturnValue(undefined);

    // Call the clear method
    await expect(npcCycle.clear()).resolves.not.toThrowError();
  });

  it("should test that the clear method does not throw an error if the NPCCycle instance is not found in the npcCycles map", async () => {
    // Remove the NPCCycle instance from the npcCycles map
    NPCCycle.npcCycles.delete(npcCycle.id);

    // Verify that the clear method does not throw an error
    await expect(npcCycle.clear()).resolves.not.toThrowError();
  });
});
