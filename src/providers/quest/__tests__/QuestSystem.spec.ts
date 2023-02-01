/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { IQuest } from "@entities/ModuleQuest/QuestModel";
import { QuestRecord } from "@entities/ModuleQuest/QuestRecordModel";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { CharacterItems } from "@providers/character/characterItems/CharacterItems";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ItemDrop } from "@providers/item/ItemDrop";
import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { FriendlyNPCsBlueprint, HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { InteractionQuestSubtype } from "@providers/unitTests/UnitTestHelper";
import { QuestStatus, QuestType } from "@rpg-engine/shared";
import { QuestSystem } from "../QuestSystem";

describe("QuestSystem.ts", () => {
  let questSystem: QuestSystem,
    characterItems: CharacterItems,
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
    characterItems = container.get<CharacterItems>(CharacterItems);
    releaseRewards = jest.spyOn(questSystem, "releaseRewards" as any);
  });

  beforeEach(async () => {
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

    // assign quest to the testCharacter
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
    expect(releaseRewards).toBeCalledTimes(1);
  });

  it("should update quest and release rewards | type interaction craft - stack remaining", async () => {
    // Equip character with required items for completing interaction craft quest
    const characterEquipment = (await Equipment.findById(testCharacter.equipment)
      .populate("inventory")
      .exec()) as IEquipment;

    const questItemKeys = [CraftingResourcesBlueprint.Silk, CraftingResourcesBlueprint.Diamond];
    await unitTestHelper.equipItemsInBackpackSlot(characterEquipment, questItemKeys, false, { stackQty: 10 });

    await questSystem.updateQuests(QuestType.Interaction, testCharacter, "");
    expect(await testInteractionCraftQuest.hasStatus(QuestStatus.Completed, testCharacter.id)).toEqual(true);
    expect(releaseRewards).toBeCalledTimes(1);

    // Check remaining stackQty: 2 silk and 8 diamond
    await assertRemainingQty(testCharacter, characterItems, questItemKeys, [2, 8]);
  });

  it("should update quest and release rewards | type interaction craft - exact qty, should remove one item", async () => {
    // Equip character with required items for completing interaction craft quest
    const characterEquipment = (await Equipment.findById(testCharacter.equipment)
      .populate("inventory")
      .exec()) as IEquipment;

    const questItemKeys = [CraftingResourcesBlueprint.Silk, CraftingResourcesBlueprint.Diamond];
    await unitTestHelper.equipItemsInBackpackSlot(characterEquipment, questItemKeys, false, { stackQty: 8 });

    await questSystem.updateQuests(QuestType.Interaction, testCharacter, "");
    expect(await testInteractionCraftQuest.hasStatus(QuestStatus.Completed, testCharacter.id)).toEqual(true);
    expect(releaseRewards).toBeCalledTimes(1);

    // Check remaining stackQty: 2 silk and 8 diamond
    await assertRemainingQty(testCharacter, characterItems, questItemKeys, [0, 6]);
  });

  it("should test that the updateQuests method does not update the quest record or release rewards if objectivesData is empty", async () => {
    // Create mock functions for the methods called by updateQuests
    const getObjectivesDataMock = jest.fn(() => ({} as any));
    const updateKillObjectiveMock = jest.fn();
    const updateInteractionObjectiveMock = jest.fn();
    const releaseRewardsMock = jest.fn();

    // @ts-ignore
    questSystem.getObjectivesData = getObjectivesDataMock;
    // @ts-ignore
    questSystem.updateKillObjective = updateKillObjectiveMock;
    // @ts-ignore
    questSystem.updateInteractionObjective = updateInteractionObjectiveMock;
    // @ts-ignore
    questSystem.releaseRewards = releaseRewardsMock;

    await questSystem.updateQuests(QuestType.Kill, testCharacter, "some target key");

    // Assert that the mock functions were called as expected
    expect(getObjectivesDataMock).toHaveBeenCalledWith(testCharacter, QuestType.Kill);
    expect(updateKillObjectiveMock).not.toHaveBeenCalled();
    expect(updateInteractionObjectiveMock).not.toHaveBeenCalled();
    expect(releaseRewardsMock).not.toHaveBeenCalled();
  });

  it("should test that the updateQuests method does not update the quest record or release rewards if the quest type is invalid", async () => {
    // Mock the dependencies of the QuestSystem class
    const socketMessagingMock = {
      sendToSocket: jest.fn(),
    } as unknown as SocketMessaging;

    const characterWeightMock = {
      addWeight: jest.fn(),
    } as unknown as CharacterWeight;

    const equipmentSlotsMock = {
      addToSlot: jest.fn(),
    } as unknown as EquipmentSlots;

    const movementHelperMock = {
      moveTo: jest.fn(),
    } as unknown as MovementHelper;
    const itemDropMock = {
      drop: jest.fn(),
    } as unknown as ItemDrop;
    const characterItemsMock = {
      removeItem: jest.fn(),
    } as unknown as CharacterItems;

    // @ts-ignore
    questSystem.socketMessaging = socketMessagingMock;
    // @ts-ignore
    questSystem.characterWeight = characterWeightMock;
    // @ts-ignore
    questSystem.equipmentSlots = equipmentSlotsMock;
    // @ts-ignore
    questSystem.movementHelper = movementHelperMock;
    // @ts-ignore
    questSystem.itemDrop = itemDropMock;
    // @ts-ignore
    questSystem.characterItems = characterItemsMock;

    const updateOneMock = jest.fn();
    QuestRecord.updateOne = updateOneMock;

    // Test the updateQuests method with an invalid quest type
    await questSystem.updateQuests("invalid quest type" as any, {} as any, "targetKey");

    // Assert that the quest record was not updated and rewards were not released
    expect(QuestRecord.updateOne).not.toHaveBeenCalled();
    // @ts-ignore
    expect(socketMessagingMock.sendToSocket).not.toHaveBeenCalled();
    // @ts-ignore
    expect(characterWeightMock.addWeight).not.toHaveBeenCalled();
    // @ts-ignore
    expect(equipmentSlotsMock.addToSlot).not.toHaveBeenCalled();
    // @ts-ignore
    expect(movementHelperMock.moveTo).not.toHaveBeenCalled();
    // @ts-ignore
    expect(itemDropMock.drop).not.toHaveBeenCalled();
    // @ts-ignore
    expect(characterItemsMock.removeItem).not.toHaveBeenCalled();
  });

  it("should test that the updateQuests method does not update the quest record or release rewards if there are no quest records with the specified status", async () => {
    // Mock the characterItems dependency of the QuestSystem class
    const characterItemsMock = {
      remove: jest.fn(),
    };

    // Test the updateQuests method with an empty objectivesData value
    await questSystem.updateQuests(QuestType.Interaction, testCharacter, "targetKey");

    // Assert that the updateOne method of the QuestRecord model was not called
    expect(QuestRecord.updateOne).not.toHaveBeenCalled();

    // Assert that the remove method of the characterItems mock was not called
    expect(characterItemsMock.remove).not.toHaveBeenCalled();
  });

  it("should test that the updateQuests method does not update the quest record or release rewards if the target key does not match any of the objectives", async () => {
    // Mock the dependencies of the QuestSystem class
    const socketMessagingMock = {
      sendMessage: jest.fn(),
    };
    const characterWeightMock = {};
    const equipmentSlotsMock = {};
    const movementHelperMock = {};
    const itemDropMock = {};
    const characterItemsMock = {};
    // @ts-ignore
    questSystem.socketMessaging = socketMessagingMock;
    // @ts-ignore
    questSystem.characterWeight = characterWeightMock;
    // @ts-ignore
    questSystem.equipmentSlots = equipmentSlotsMock;
    // @ts-ignore
    questSystem.movementHelper = movementHelperMock;
    // @ts-ignore
    questSystem.itemDrop = itemDropMock;
    // @ts-ignore
    questSystem.characterItems = characterItemsMock;

    // Mock the getObjectivesData method to return a set of objectives and records
    // @ts-ignore
    questSystem.getObjectivesData = jest.fn(() => ({
      objectives: [{ targetKey: "key1" }, { targetKey: "key2" }],
      records: [{}],
    }));

    // Mock the updateInteractionObjective method to return undefined
    // @ts-ignore
    questSystem.updateInteractionObjective = jest.fn(() => undefined);

    // Mock the QuestRecord.updateOne method to not be called
    const updateOneSpy = jest.spyOn(QuestRecord, "updateOne");

    // Test the updateQuests method with a target key that does not match any of the objectives
    await questSystem.updateQuests(QuestType.Interaction, testCharacter, "key3");

    // Assert that the QuestRecord.updateOne method was not called
    expect(updateOneSpy).not.toHaveBeenCalled();
  });

  it("should throw an error in updateQuests if the quest type is invalid", async () => {
    // Define a quest type that is not recognized by the QuestSystem
    const invalidQuestType: QuestType = "invalid" as QuestType;

    // Mock the getObjectivesData method to return a set of objectives and records
    // @ts-ignore
    questSystem.getObjectivesData = jest.fn(() => ({
      objectives: [{ targetKey: "key1" }, { targetKey: "key2" }],
      records: [{}],
    }));

    // Expect the updateQuests method to throw an error when called with the invalid quest type
    await expect(questSystem.updateQuests(invalidQuestType, testCharacter, creatureKey)).rejects.toThrowError(
      `Invalid quest type ${invalidQuestType}`
    );
  });

  it("should return undefined with empty objectives", async () => {
    const objectivesData = { objectives: [], records: [] };

    // @ts-ignore
    const result = await questSystem.updateKillObjective(objectivesData, "targetKey");

    expect(result).toBe(undefined);
  });

  // it("should return an empty object if there are no quest records with the specified status", async () => {
  //   // // Set up the mock functions to return the specified data
  //   jest.spyOn(QuestRecord, "find").mockResolvedValue([]);
  //   jest.spyOn(QuestObjectiveInteraction, "find").mockResolvedValue([]);
  //   jest.spyOn(QuestObjectiveKill, "find").mockResolvedValue([]);

  //   // Test the getObjectivesData method
  //   // @ts-ignore
  //   const result = await questSystem.getObjectivesData(testCharacter, QuestType.Interaction, QuestStatus.InProgress);

  //   // Assert that the result is as expected
  //   expect(result).toEqual({});
  // });

  // it("should throw an error in getObjectivesData if the quest type is invalid", async () => {
  //   const invalidQuestType: QuestType = "invalid" as QuestType;

  //   await expect(
  //     // @ts-ignore
  //     questSystem.getObjectivesData(testCharacter, invalidQuestType, QuestStatus.InProgress)
  //   ).rejects.toThrowError(`invalid quest type: ${invalidQuestType}`);
  // });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
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

async function assertRemainingQty(
  character: ICharacter,
  characterItems: CharacterItems,
  itemKeys: string[],
  expectedQty: number[]
): Promise<void> {
  for (const i in itemKeys) {
    const k = itemKeys[i];
    const expQty = expectedQty[i];
    const foundItem = await characterItems.hasItemByKey(k, character, "inventory");
    // should be deleted if all stackQty is consumed
    if (expQty === 0) {
      expect(foundItem).toBeUndefined();
      continue;
    }
    if (!foundItem) {
      throw new Error(`Item with key ${k} not found on characters items`);
    }
    const item = await Item.findById(foundItem.itemId);
    expect(item!.stackQty).toEqual(expQty);
  }
}
