/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { IQuest } from "@entities/ModuleQuest/QuestModel";
import { QuestObjectiveKill } from "@entities/ModuleQuest/QuestObjectiveModel";
import { unitTestHelper } from "@providers/inversify/container";
import { QuestStatus } from "@rpg-engine/shared";
import { INPC } from "../NPCModel";

describe("NPCModel.ts", () => {
  let testNPCwithQuest: INPC;
  let testNPCNoQuest: INPC;
  let testQuest: IQuest;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testNPCNoQuest = await unitTestHelper.createMockNPC();
    testNPCwithQuest = await unitTestHelper.createMockNPC();
    testQuest = await unitTestHelper.createMockQuest(testNPCwithQuest.id);
  });

  it("validate hasQuest function", async () => {
    expect(await testNPCwithQuest.hasQuest).toEqual(true);
    expect(await testNPCNoQuest.hasQuest).toEqual(false);
  });

  it("hasQuest should be false once quest is not Pending anymore", async () => {
    const obj = await QuestObjectiveKill.findById(testQuest.objectives![0]);

    // Update status
    obj!.status = QuestStatus.InProgress;
    await obj!.save();

    expect(await testNPCwithQuest.hasQuest).toEqual(false);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
