/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { container, unitTestHelper } from "@providers/inversify/container";
import { NPCQuest } from "@providers/npc/NPCQuest";
import { INPC } from "../NPCModel";

describe("NPCModel.ts", () => {
  let testNPCwithQuest: INPC;
  let testNPCNoQuest: INPC;
  let npcQuest: NPCQuest;

  beforeEach(async () => {
    testNPCNoQuest = await unitTestHelper.createMockNPC();
    testNPCwithQuest = await unitTestHelper.createMockNPC();
    await unitTestHelper.createMockQuest(testNPCwithQuest.id);

    npcQuest = container.get<NPCQuest>(NPCQuest);
  });

  it("validate hasQuest function", async () => {
    const hasQuest1 = await npcQuest.hasQuest(testNPCwithQuest);
    const hasQuest2 = await npcQuest.hasQuest(testNPCNoQuest);

    expect(hasQuest1).toEqual(true);
    expect(hasQuest2).toEqual(false);
  });
});
