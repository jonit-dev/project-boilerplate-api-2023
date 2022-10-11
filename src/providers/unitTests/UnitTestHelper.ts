import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { IQuest, Quest } from "@entities/ModuleQuest/QuestModel";
import { QuestObjectiveInteraction, QuestObjectiveKill } from "@entities/ModuleQuest/QuestObjectiveModel";
import { QuestReward } from "@entities/ModuleQuest/QuestRewardModel";
import { ChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { container, mapLoader } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { BodiesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { characterMock } from "@providers/unitTests/mock/characterMock";
import {
  fixedPathMockNPC,
  moveAwayMockNPC,
  moveTowardsMockNPC,
  randomMovementMockNPC,
  stoppedMovementMockNPC,
} from "@providers/unitTests/mock/NPCMock";
import { ISocketTransmissionZone, NPCMovementType, QuestType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { chatLogsMock } from "./mock/chatLogsMock";
import { itemMock, itemTwoHandedMock, stackableItemMock } from "./mock/itemMock";
import { questInteractionObjectiveMock, questKillObjectiveMock, questMock, questRewardsMock } from "./mock/questMock";

interface IMockCharacterOptions {
  hasEquipment?: boolean;
  hasInventory?: boolean;
  hasSkills?: boolean;
}

interface IMockNPCOptions {
  hasSkills?: boolean;
}

interface IMockQuestOptions {
  type?: QuestType;
  objectivesCount?: number;
}

@provide(UnitTestHelper)
export class UnitTestHelper {
  private mongoServer: MongoMemoryServer;

  public async initializeMapLoader(): Promise<void> {
    jest
      // @ts-ignore
      .spyOn(mapLoader, "getMapNames")
      // @ts-ignore
      .mockImplementation(() => ["unit-test-map.json", "example.json", "unit-test-map-negative-coordinate.json"]);

    await mapLoader.init(true);
  }

  public async createMockNPC(
    extraProps: Record<string, unknown> | null = null,
    options: IMockNPCOptions | null = null,
    movementType: NPCMovementType = NPCMovementType.Random
  ): Promise<INPC> {
    const movementTypeMock = {
      [NPCMovementType.FixedPath]: fixedPathMockNPC,
      [NPCMovementType.MoveAway]: moveAwayMockNPC,
      [NPCMovementType.MoveTowards]: moveTowardsMockNPC,
      [NPCMovementType.Random]: randomMovementMockNPC,
      [NPCMovementType.Stopped]: stoppedMovementMockNPC,
    };
    const testNPC = new NPC({
      ...movementTypeMock[movementType],
      ...extraProps,
      experience: 100,
      loots: [
        {
          itemBlueprintKey: "cheese",
          chance: 100,
          quantityRange: [1, 2],
        },
      ],
    });

    if (options?.hasSkills) {
      const npcSkills = new Skill({
        ownerType: "NPC",
      });

      npcSkills.owner = testNPC._id;
      testNPC.skills = npcSkills._id;
      await npcSkills.save();
    }

    await testNPC.save();

    return testNPC;
  }

  public async addItemsToInventoryContainer(
    container: IItemContainer,
    slotQty: number,
    items: IItem[]
  ): Promise<IItemContainer> {
    container.slotQty = slotQty;

    const slots = {};
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      slots[i] = item.toJSON({ virtuals: true });
    }

    container.slots = slots;
    container.markModified("slots");
    await container.save();

    return container;
  }

  public async createMockItemContainer(character: ICharacter): Promise<IItem> {
    const blueprintData = itemsBlueprintIndex[BodiesBlueprint.CharacterBody];

    const charBody = new Item({
      ...blueprintData,
      owner: character.id,
      name: `${character.name}'s body`,
      scene: character.scene,
      x: character.x,
      y: character.y,
      generateContainerSlots: 20,
      isItemContainer: true,
    });

    await charBody.save();

    const item = await Item.findById(charBody._id).populate("itemContainer").exec();

    return item as IItem;
  }

  public async createMockItemFromBlueprint(blueprintKey: string, extraProps?: Partial<IItem>): Promise<IItem> {
    const blueprintData = itemsBlueprintIndex[blueprintKey];

    const newItem = new Item({
      ...blueprintData,
      ...extraProps,
    });

    await newItem.save();

    return newItem;
  }

  public async createMockItem(extraProps?: Partial<IItem>): Promise<IItem> {
    const newItem = new Item({
      ...itemMock,
      ...extraProps,
    });

    await newItem.save();

    return newItem;
  }

  public async createMockItemTwoHanded(extraProps?: Partial<IItem>): Promise<IItem> {
    const newItem = new Item({
      ...itemTwoHandedMock,
      ...extraProps,
    });

    await newItem.save();

    return newItem;
  }

  public async createStackableMockItem(extraProps?: Partial<IItem>): Promise<IItem> {
    const newItem = new Item({
      ...stackableItemMock,
      ...extraProps,
    });

    await newItem.save();

    return newItem;
  }

  public async createMockCharacter(
    extraProps?: Record<string, unknown> | null,
    options?: IMockCharacterOptions
  ): Promise<ICharacter> {
    const testCharacter = new Character({
      ...characterMock,
      ...extraProps,
    });

    if (options?.hasSkills) {
      const charSkills = new Skill({
        ownerType: "Character",
      });
      charSkills.owner = testCharacter._id;
      testCharacter.skills = charSkills._id;
      await charSkills.save();
    }

    if (options?.hasEquipment) {
      let equipment;
      if (options?.hasInventory) {
        equipment = await this.addInventoryToCharacter(testCharacter);
      } else {
        equipment = new Equipment();
      }
      await equipment.save();
      testCharacter.equipment = equipment._id;
    }

    await testCharacter.save();
    return testCharacter;
  }

  public async addInventoryToCharacter(character: ICharacter): Promise<IEquipment> {
    const characterInventory = container.get<CharacterInventory>(CharacterInventory);

    const equipment = await characterInventory.createEquipmentWithInventory(character);

    return equipment;
  }

  public async createMockChatLogs(emitter: ICharacter): Promise<void> {
    for (const chatLogMock of chatLogsMock) {
      chatLogMock.emitter = emitter._id;
      const chatLog = new ChatLog(chatLogMock);
      await chatLog.save();
    }
  }

  public async createEquipment(extraProps?: Partial<IItem>): Promise<IEquipment> {
    const equipment = new Equipment();

    const itemHead = new Item({
      ...itemMock,
      ...extraProps,
      _id: undefined,
      defense: 10,
      attack: 8,
    });

    const itemNeck = new Item({
      ...itemMock,
      ...extraProps,
      _id: undefined,
      defense: 4,
      attack: 5,
    });

    await itemHead.save();
    await itemNeck.save();

    equipment.head = itemHead._id;
    equipment.neck = itemNeck._id;

    return await equipment.save();
  }

  public createMockSocketTransmissionZone(x: number, y: number, width: number, height: number): SocketTransmissionZone {
    const socketTransmissionZone = container.get<SocketTransmissionZone>(SocketTransmissionZone);

    jest.spyOn(socketTransmissionZone, "calculateSocketTransmissionZone").mockImplementation(
      () =>
        ({
          x,
          y,
          width,
          height,
        } as ISocketTransmissionZone)
    );
    return socketTransmissionZone;
  }

  public async createMockBackpackItemContainer(parent: IItem, extraProps?: Partial<IItem>): Promise<IItemContainer> {
    const slotQty: number = 20;

    const backpackContainer = new ItemContainer({
      name: parent.name,
      parentItem: parent._id,
      owner: parent.owner,
    });

    const weaponItem = new Item({
      ...itemMock,
      ...extraProps,
      defense: 10,
      attack: 8,
    });

    const foodItem = new Item({
      ...stackableItemMock,
      ...extraProps,
    });

    await foodItem.save();
    await weaponItem.save();

    const slots = {};

    for (let i = 0; i < slotQty; i++) {
      slots[Number(i)] = null;
    }

    slots[0] = foodItem._id;
    slots[1] = weaponItem._id;

    backpackContainer.slots = slots;

    return backpackContainer.save();
  }

  public async createMockQuest(
    npcId: string,
    options?: IMockQuestOptions,
    extraProps?: Record<string, unknown> | null
  ): Promise<IQuest> {
    if (!npcId) {
      throw new Error("need to provide npc id to create a mock quest");
    }

    let testQuestRewards = new QuestReward({
      ...questRewardsMock,
    });
    testQuestRewards = await testQuestRewards.save();

    const testQuest = new Quest({
      ...questMock,
      ...extraProps,
      npcId,
      rewards: [testQuestRewards._id],
      objectives: [],
    });

    const objCount = options ? options.objectivesCount || 1 : 1;

    if (options && options.type) {
      switch (options.type) {
        case QuestType.Interaction:
          for (let i = 0; i < objCount; i++) {
            await this.addQuestInteractionObjectiveMock(testQuest);
          }
          break;

        case QuestType.Kill:
          for (let i = 0; i < objCount; i++) {
            await this.addQuestKillObjectiveMock(testQuest);
          }
          break;
        default:
          throw new Error(`unsupported quest type ${options.type}`);
      }
    } else {
      // by default create 1 objective kill
      for (let i = 0; i < objCount; i++) {
        await this.addQuestKillObjectiveMock(testQuest);
      }
    }

    return testQuest.save();
  }

  private async addQuestInteractionObjectiveMock(quest: IQuest): Promise<void> {
    let testQuestObjectiveInteraction = new QuestObjectiveInteraction({
      ...questInteractionObjectiveMock,
    });
    testQuestObjectiveInteraction = await testQuestObjectiveInteraction.save();
    quest.objectives!.push(testQuestObjectiveInteraction._id);
  }

  private async addQuestKillObjectiveMock(quest: IQuest): Promise<void> {
    let testQuestObjectiveKill = new QuestObjectiveKill({
      ...questKillObjectiveMock,
    });
    testQuestObjectiveKill = await testQuestObjectiveKill.save();
    quest.objectives!.push(testQuestObjectiveKill._id);
  }

  public async beforeAllJestHook(): Promise<void> {
    this.mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(this.mongoServer.getUri(), {
      dbName: "test-database",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  }

  public async beforeEachJestHook(dropDatabase?: boolean): Promise<void> {
    if (dropDatabase) {
      await mongoose.connection.dropDatabase();
    }
  }

  public async afterAllJestHook(): Promise<void> {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (this.mongoServer) {
      await this.mongoServer.stop();
    }
  }
}
