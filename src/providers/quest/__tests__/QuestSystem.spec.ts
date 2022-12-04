/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { IQuest } from "@entities/ModuleQuest/QuestModel";
import { QuestRecord } from "@entities/ModuleQuest/QuestRecordModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FriendlyNPCsBlueprint, HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { InteractionQuestSubtype } from "@providers/unitTests/UnitTestHelper";
import { QuestStatus, QuestType } from "@rpg-engine/shared";
import { QuestSystem } from "../QuestSystem";
import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";

describe("QuestSystem.ts", () => {
  let questSystem: QuestSystem,
    testNPC: INPC,
    testCharacter: ICharacter,
    testKillQuest: IQuest,
    testInteractionQuest: IQuest,
    testInteractionCraftQuest: IQuest,
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
    testInteractionCraftQuest = await unitTestHelper.createMockQuest(testNPC.id, {
      type: QuestType.Interaction,
      subtype: InteractionQuestSubtype.craft,
    });

    // asign quest to the testCharacter
    await createQuestRecord(testKillQuest, testCharacter);
    await createQuestRecord(testInteractionQuest, testCharacter);
    await createQuestRecord(testInteractionCraftQuest, testCharacter);
  });

  it("should update quest and release rewards | type kill", async () => {
    // Kill 5 creatures to complete 1 objective
    for (let i = 1; i <= 5 * objectivesCount; i++) {
      await questSystem.updateQuests(QuestType.Kill, testCharacter, creatureKey);
      if (i !== 5 * objectivesCount) {
        expect(await testKillQuest.hasStatus(QuestStatus.InProgress, testCharacter.id)).toEqual(true);
      } else {
        expect(await testKillQuest.hasStatus(QuestStatus.Completed, testCharacter.id)).toEqual(true);
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
    expect(await testInteractionQuest.hasStatus(QuestStatus.Completed, testCharacter.id)).toEqual(true);
    expect(releaseRewards).toBeCalledTimes(2);
  });

  it("should update quest and release rewards | type interaction craft", async () => {
    // Equip character with required items for completing interaction craft quest
    const characterEquipment = (await Equipment.findById(testCharacter.equipment)
      .populate("inventory")
      .exec()) as IEquipment;
    await unitTestHelper.equipItemsInBackpackSlot(characterEquipment, [
      CraftingResourcesBlueprint.Silk,
      CraftingResourcesBlueprint.Diamond,
    ]);

    await questSystem.updateQuests(QuestType.Interaction, testCharacter, "");
    expect(await testInteractionCraftQuest.hasStatus(QuestStatus.Completed, testCharacter.id)).toEqual(true);
    expect(releaseRewards).toBeCalledTimes(3);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

async function createQuestRecord(quest: IQuest, character: ICharacter): Promise<void> {
  const objs = await quest.objectivesDetails;
  for (const obj of objs) {
    const questRecord = new QuestRecord();
    questRecord.quest = quest._id;
    questRecord.character = character._id;
    questRecord.objective = obj._id;
    questRecord.status = QuestStatus.InProgress;
    await questRecord.save();
  }
}
