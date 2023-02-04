/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { unitTestHelper } from "@providers/inversify/container";
import { QuestStatus, QuestType } from "@rpg-engine/shared";
import { IQuest } from "../QuestModel";
import { QuestObjectiveKill } from "../QuestObjectiveModel";
import { QuestRecord } from "../QuestRecordModel";

describe("QuestModel.ts", () => {
  let testNPC: INPC;
  let testQuest: IQuest;
  let testCharacter: ICharacter;

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC();
    testQuest = await unitTestHelper.createMockQuest(testNPC.id);
    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("validate hasStatus function - quest with one objective", async () => {
    expect(await testQuest.hasStatus(QuestStatus.Pending, testCharacter.id)).toEqual(true);
    const obj = await QuestObjectiveKill.findById(testQuest.objectives![0]);

    // Create quest records and update to completed status
    const record = new QuestRecord({
      quest: testQuest._id,
      objective: obj!._id,
      character: testCharacter.id,
      status: QuestStatus.Completed,
    });
    await record.save();

    expect(await testQuest.hasStatus(QuestStatus.Completed, testCharacter.id)).toEqual(true);
  });

  it("validate hasStatus function - quest with multiple objectives", async () => {
    const objectivesCount = 5;
    testQuest = await unitTestHelper.createMockQuest(testNPC.id, { type: QuestType.Kill, objectivesCount });

    expect(await testQuest.hasStatus(QuestStatus.Pending, testCharacter.id)).toEqual(true);

    // Create quest records for character
    for (let i = 0; i < objectivesCount; i++) {
      const obj = await QuestObjectiveKill.findById(testQuest.objectives![i]);
      const record = new QuestRecord({
        quest: testQuest._id,
        objective: obj!._id,
        character: testCharacter.id,
        status: QuestStatus.InProgress,
      });
      await record.save();
    }

    expect(await testQuest.hasStatus(QuestStatus.InProgress, testCharacter.id)).toEqual(true);

    const records = await QuestRecord.find({ quest: testQuest._id, character: testCharacter.id });
    for (let i = 0; i < objectivesCount; i++) {
      const record = records[i];
      // Update status - some objectives completed, others pending
      record.status = QuestStatus.Completed;
      await record.save();

      if (i !== 4) {
        expect(await testQuest.hasStatus(QuestStatus.InProgress, testCharacter.id)).toEqual(true);
      } else {
        expect(await testQuest.hasStatus(QuestStatus.Completed, testCharacter.id)).toEqual(true);
      }
    }
  });
});
