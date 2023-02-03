/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { unitTestHelper } from "@providers/inversify/container";
import { INPC } from "../NPCModel";

describe("NPCModel.ts", () => {
  let testNPCwithQuest: INPC;
  let testNPCNoQuest: INPC;

  beforeEach(async () => {
    testNPCNoQuest = await unitTestHelper.createMockNPC();
    testNPCwithQuest = await unitTestHelper.createMockNPC();
    await unitTestHelper.createMockQuest(testNPCwithQuest.id);
  });

  it("validate hasQuest function", async () => {
    expect(await testNPCwithQuest.hasQuest).toEqual(true);
    expect(await testNPCNoQuest.hasQuest).toEqual(false);
  });
});
