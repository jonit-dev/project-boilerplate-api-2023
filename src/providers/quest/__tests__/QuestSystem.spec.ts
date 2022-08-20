/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { container, unitTestHelper } from "@providers/inversify/container";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { IQuest } from "@entities/ModuleQuest/QuestModel";
import { QuestStatus, QuestType } from "@rpg-engine/shared";
import { QuestSystem } from "../QuestSystem";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { FriendlyNPCsBlueprint, HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { QuestRecord } from "@entities/ModuleQuest/QuestRecordModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";

describe("QuestSystem.ts", () => {
  let questSystem: QuestSystem,
    testNPC: INPC,
    testCharacter: ICharacter,
    testKillQuest: IQuest,
    testInteractionQuest: IQuest,
    releaseRewards: any;
  const creatureKey = HostileNPCsBlueprint.Orc;
  const npcKey = FriendlyNPCsBlueprint.Alice;
  const objectivesCount = 2;

  beforeAll(async () => {
    questSystem = container.get<QuestSystem>(QuestSystem);
    releaseRewards = jest.spyOn(questSystem, "releaseRewards" as any);
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

    // asign quest to the testCharacter
    const objectives = await testKillQuest.objectivesDetails;
    // @ts-ignore
    objectives.push(...(await testInteractionQuest.objectivesDetails));

    for (const obj of objectives) {
      const questRecord = new QuestRecord();
      questRecord.character = testCharacter._id;
      questRecord.objective = obj._id;
      await questRecord.save();

      obj.status = QuestStatus.InProgress;
      await obj.save();
    }
  });

  it("should update quest and release rewards | type kill", async () => {
    // Kill 5 creatures to complete 1 objective
    for (let i = 1; i <= 5 * objectivesCount; i++) {
      await questSystem.updateQuests(QuestType.Kill, testCharacter, creatureKey);
      if (i !== 5 * objectivesCount) {
        expect(await testKillQuest.hasStatus(QuestStatus.InProgress)).toEqual(true);
      } else {
        expect(await testKillQuest.hasStatus(QuestStatus.Completed)).toEqual(true);
        expect(releaseRewards).toBeCalledTimes(1);
      }
    }

    // Reward (1 item) should be placed on characters inventory
    const equipment = await Equipment.findById(testCharacter.equipment).populate("inventory").exec();
    const backpack = equipment!.inventory as unknown as IItem;
    const backpackContainer = await ItemContainer.findById(backpack.itemContainer);
    expect(backpackContainer!.emptySlotsQty === backpackContainer!.slotQty - 1).toEqual(true);
  });

  it("should update quest and release rewards | type interaction", async () => {
    await questSystem.updateQuests(QuestType.Interaction, testCharacter, npcKey);
    expect(await testInteractionQuest.hasStatus(QuestStatus.Completed)).toEqual(true);
    expect(releaseRewards).toBeCalledTimes(2);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
