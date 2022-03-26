/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { INPC } from "@entities/ModuleSystem/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { NPCView } from "../NPCView";

describe("NPCView.ts", () => {
  let npcView: NPCView;
  let testNPC: INPC;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    testNPC = await unitTestHelper.createMockNPC();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    npcView = container.get<NPCView>(NPCView);
  });

  it("should characters that are inside the NPC socket transmission zone", async () => {
    const testCharInsideView = await unitTestHelper.createMockCharacter();

    const charactersInView = await npcView.getCharactersInView(testNPC);

    const hasTestCharacter = charactersInView.some((character) => {
      return character.name === testCharInsideView.name;
    });

    expect(hasTestCharacter).toBeTruthy();
  });

  it("should not fetch any character if its X and Y position is outside socket transmission zone", async () => {
    const charOutsideView = await unitTestHelper.createMockCharacter({
      x: 240,
      y: 1000,
    });

    const charactersInView = await npcView.getCharactersInView(testNPC);

    const hasCharacter = charactersInView.some((character) => {
      return character.name === charOutsideView.name;
    });

    expect(hasCharacter).toBeFalsy();
    expect(charactersInView).toHaveLength(0); // only test character is inside view, not this one we just created now
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

// your code here
