/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { unitTestHelper } from "@providers/inversify/container";
import { QuestStatus, QuestType } from "@rpg-engine/shared";
import { IQuest } from "../QuestModel";
import { QuestObjectiveKill } from "../QuestObjectiveModel";

describe("QuestModel.ts", () => {
  let testNPC: INPC;
  let testQuest: IQuest;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testNPC = await unitTestHelper.createMockNPC();
    testQuest = await unitTestHelper.createMockQuest(testNPC.id);
  });

  it("validate hasStatus function - quest with one objective", async () => {
    expect(await testQuest.hasStatus(QuestStatus.Pending)).toEqual(true);
    const obj = await QuestObjectiveKill.findById(testQuest.objectives![0]);

    // Update status
    obj!.status = QuestStatus.Completed;
    await obj!.save();

    expect(await testQuest.hasStatus(QuestStatus.Completed)).toEqual(true);
  });

  it("validate hasStatus function - quest with multiple objectives", async () => {
    testQuest = await unitTestHelper.createMockQuest(testNPC.id, { type: QuestType.Kill, objectivesCount: 5 });

    expect(await testQuest.hasStatus(QuestStatus.Pending)).toEqual(true);
    const obj = await QuestObjectiveKill.findById(testQuest.objectives![0]);

    // Update status
    obj!.status = QuestStatus.InProgress;
    await obj!.save();

    expect(await testQuest.hasStatus(QuestStatus.InProgress)).toEqual(true);

    for (let i = 0; i < 5; i++) {
      const obj = await QuestObjectiveKill.findById(testQuest.objectives![i]);
      // Update status - some objectives completed, others pending
      obj!.status = QuestStatus.Completed;
      await obj!.save();
      if (i !== 4) {
        expect(await testQuest.hasStatus(QuestStatus.InProgress)).toEqual(true);
      } else {
        expect(await testQuest.hasStatus(QuestStatus.Completed)).toEqual(true);
      }
    }
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
