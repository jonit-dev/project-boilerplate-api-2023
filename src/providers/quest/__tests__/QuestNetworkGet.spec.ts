/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { container, unitTestHelper } from "@providers/inversify/container";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { IQuest } from "@entities/ModuleQuest/QuestModel";
import { QuestStatus, QuestType } from "@rpg-engine/shared";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { QuestRecord } from "@entities/ModuleQuest/QuestRecordModel";
import { QuestNetworkGet } from "../network/QuestNetworkGet";

describe("QuestNetworkGet.ts", () => {
  let questNetworkGet: QuestNetworkGet,
    testNPC: INPC,
    testCharacter: ICharacter,
    testKillQuest: IQuest,
    testInteractionQuest: IQuest;
  const objectivesCount = 2;

  beforeAll(async () => {
    questNetworkGet = container.get<QuestNetworkGet>(QuestNetworkGet);
    await unitTestHelper.beforeAllJestHook();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasSkills: true,
      hasInventory: true,
    });
    testNPC = await unitTestHelper.createMockNPC();
    testKillQuest = await unitTestHelper.createMockQuest(testNPC.id, { objectivesCount });
    testInteractionQuest = await unitTestHelper.createMockQuest(testNPC.id, { type: QuestType.Interaction });

    testCharacter.x = 1;
    testCharacter.y = 0;
    await testCharacter.save();

    testNPC.x = 1;
    testNPC.y = 1;
    await testNPC.save();

    // asign quest to the testCharacter
    const killObjs = await testKillQuest.objectivesDetails;
    // @ts-ignore
    const interactObjs = await testInteractionQuest.objectivesDetails;

    for (const obj of killObjs) {
      const questRecord = new QuestRecord();
      questRecord.quest = testKillQuest._id;
      questRecord.character = testCharacter._id;
      questRecord.objective = obj._id;
      questRecord.status = QuestStatus.InProgress;
      await questRecord.save();
    }

    for (const obj of interactObjs) {
      const questRecord = new QuestRecord();
      questRecord.quest = testInteractionQuest._id;
      questRecord.character = testCharacter._id;
      questRecord.objective = obj._id;
      questRecord.status = QuestStatus.InProgress;
      await questRecord.save();
    }
  });

  it("should get all character's quests | no status defined", async () => {
    // if status is not provided, should return all quests
    // @ts-ignore
    const quests = await questNetworkGet.getCharacterQuests({ characterId: testCharacter.id }, testCharacter);

    expect(quests).toBeDefined();
    expect(quests!.quests).toHaveLength(2);
  });

  it("should get character's quests | status defined", async () => {
    // @ts-ignore
    const inProgressQuests = await questNetworkGet.getCharacterQuests(
      { characterId: testCharacter.id, status: QuestStatus.InProgress },
      testCharacter
    );

    expect(inProgressQuests).toBeDefined();
    expect(inProgressQuests!.quests).toHaveLength(2);

    // @ts-ignore
    const pendingQuests = await questNetworkGet.getCharacterQuests(
      { characterId: testCharacter.id, status: QuestStatus.Pending },
      testCharacter
    );

    expect(pendingQuests).toBeDefined();
    expect(pendingQuests!.quests).toHaveLength(0);
  });

  it("try get NPC's quests without status | should fail", async () => {
    try {
      // if status is not provided, should return throw an error
      // @ts-ignore
      await questNetworkGet.getNPCQuests(testNPC, { npcId: testNPC.id }, testCharacter);
      throw new Error("This should fail");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should get NPC's quests | status defined", async () => {
    // @ts-ignore
    const inProgressQuests = await questNetworkGet.getNPCQuests(
      testNPC,
      { npcId: testNPC.id, status: QuestStatus.InProgress },
      testCharacter
    );

    expect(inProgressQuests).toBeDefined();
    expect(inProgressQuests!.quests).toHaveLength(2);

    // @ts-ignore
    const pendingQuests = await questNetworkGet.getNPCQuests(
      testNPC,
      { npcId: testNPC.id, status: QuestStatus.Pending },
      testCharacter
    );

    expect(pendingQuests).toBeUndefined();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
