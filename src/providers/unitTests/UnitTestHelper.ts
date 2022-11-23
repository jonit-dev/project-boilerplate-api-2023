import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { Depot, IDepot } from "@entities/ModuleDepot/DepotModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { IQuest, Quest } from "@entities/ModuleQuest/QuestModel";
import { QuestObjectiveInteraction, QuestObjectiveKill } from "@entities/ModuleQuest/QuestObjectiveModel";
import { QuestReward } from "@entities/ModuleQuest/QuestRewardModel";
import { ChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { IControlTime, MapControlTimeModel } from "@entities/ModuleSystem/MapControlTimeModel";
import { IUser, User } from "@entities/ModuleSystem/UserModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { CharacterItems } from "@providers/character/characterItems/CharacterItems";
import { EquipmentEquip } from "@providers/equipment/EquipmentEquip";
import { container, mapLoader } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { BodiesBlueprint, ContainersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { characterMock } from "@providers/unitTests/mock/characterMock";
import {
  fixedPathMockNPC,
  moveAwayMockNPC,
  moveTowardsMockNPC,
  randomMovementMockNPC,
  stoppedMovementMockNPC,
} from "@providers/unitTests/mock/NPCMock";
import { ISocketTransmissionZone, NPCMovementType, PeriodOfDay, QuestType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { chatLogsMock } from "./mock/chatLogsMock";
import {
  itemMock,
  itemMockArmor,
  itemTwoHandedMock,
  stackableGoldCoinMock,
  stackableItemMock,
  itemMockShield,
  itemMockBow,
  itemMeleeRangedMock,
} from "./mock/itemMock";
import { questInteractionObjectiveMock, questKillObjectiveMock, questMock, questRewardsMock } from "./mock/questMock";
import { userMock } from "./mock/userMock";

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
  private characterItems: CharacterItems;

  public async initializeMapLoader(): Promise<void> {
    jest
      // @ts-ignore
      .spyOn(mapLoader, "getMapNames")
      // @ts-ignore
      .mockImplementation(() => ["unit-test-map.json", "example.json", "unit-test-map-negative-coordinate.json"]);

    await mapLoader.init();
  }

  public async createWeatherControlMock(
    time: string,
    period: PeriodOfDay,
    weather: string,
    createdAt?: Date
  ): Promise<IControlTime> {
    const weatherControl = new MapControlTimeModel({
      time: time,
      period: period,
      weather: weather,
      createdAt: createdAt,
    });
    await weatherControl.save();

    return weatherControl;
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

  public async createItemBow(extraProps?: Partial<IItem>): Promise<IItem> {
    const itemBow = new Item({
      ...itemMockBow,
      ...extraProps,
      _id: undefined,
    });

    await itemBow.save();

    return itemBow;
  }

  public async createItemMeleeRanged(extraProps?: Partial<IItem>): Promise<IItem> {
    const itemMeleeRanged = new Item({
      ...itemMeleeRangedMock,
      ...extraProps,
      _id: undefined,
    });

    await itemMeleeRanged.save();

    return itemMeleeRanged;
  }

  public async createMockItemTwoHanded(extraProps?: Partial<IItem>): Promise<IItem> {
    const itemTwoHanded = new Item({
      ...itemTwoHandedMock,
      ...extraProps,
    });

    await itemTwoHanded.save();

    return itemTwoHanded;
  }

  public async createMockArmor(extraProps?: Partial<IItem>): Promise<IItem> {
    const newItem = new Item({
      ...itemMockArmor,
      ...extraProps,
    });

    await newItem.save();

    return newItem;
  }

  public async createMockShield(extraProps?: Partial<IItem>): Promise<IItem> {
    const newItem = new Item({
      ...itemMockShield,
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

  public async createGoldCoinMockItem(extraProps?: Partial<IItem>): Promise<IItem> {
    const newItem = new Item({
      ...stackableGoldCoinMock,
      ...extraProps,
    });

    await newItem.save();

    return newItem;
  }

  public async createMockAndEquipItens(character: ICharacter, extraProps?: Partial<IItem>): Promise<void> {
    const itemSword = await this.createMockItem();
    const itemArmor = await this.createMockArmor();
    const equipmentEquip: EquipmentEquip = container.get<EquipmentEquip>(EquipmentEquip);

    const inventory = await character.inventory;

    const inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    inventoryContainer.slots[0] = itemSword;
    inventoryContainer.slots[1] = itemArmor;
    inventoryContainer.markModified("slots");

    await inventoryContainer.save();

    await equipmentEquip.equip(character, itemSword._id, inventoryContainer.id);

    await equipmentEquip.equip(character, itemArmor._id, inventoryContainer.id);
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

    const equipment = await characterInventory.generateNewInventory(character, ContainersBlueprint.Backpack);

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

    const itemLeftHand = new Item({
      ...itemMockBow,
      ...extraProps,
      _id: undefined,
    });

    await itemHead.save();
    await itemNeck.save();
    await itemLeftHand.save();

    equipment.head = itemHead._id;
    equipment.neck = itemNeck._id;
    equipment.leftHand = itemLeftHand._id;

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

  public async consumeMockItem(
    character: ICharacter,
    inventoryContainer: IItemContainer,
    item: IItem
  ): Promise<boolean> {
    let stackReduced = false;
    if (item.maxStackSize > 1 && item.stackQty && item.stackQty > 1) {
      item.stackQty -= 1;
      await item.save();

      for (let i = 0; i < inventoryContainer.slotQty; i++) {
        const slotItem = inventoryContainer.slots?.[i];
        if (slotItem && slotItem.key === item.key && !stackReduced) {
          inventoryContainer.slots[i].stackQty = item.stackQty;
          stackReduced = true;
        }
      }

      inventoryContainer.markModified("slots");
      await inventoryContainer.save();
    }

    if (!stackReduced && item.stackQty && item.stackQty > 0) {
      await Item.deleteOne({ _id: item._id });

      return false;
    }

    return true;
  }

  public async createMockUser(extraProps?: Partial<IUser>): Promise<IUser> {
    const newUser = new User({
      ...userMock,
      ...extraProps,
    });

    await newUser.save();

    return newUser;
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

  public async createMockDepot(
    npcId: string,
    characterId: string,
    extraProps?: Partial<IItemContainer>
  ): Promise<IDepot> {
    if (!npcId) {
      throw new Error("need to provide npc id to create a mock depot");
    }

    if (!characterId) {
      throw new Error("need to provide npc id to create a mock depot");
    }
    let newDepot = new Depot({
      owner: characterId,
      npc: npcId,
    });

    newDepot = await newDepot.save();

    let depotItemContainer = new ItemContainer({
      parentItem: newDepot._id,
      ...extraProps,
    });
    depotItemContainer = await depotItemContainer.save();

    await Depot.updateOne(
      {
        _id: newDepot._id,
      },
      {
        $set: {
          itemContainer: depotItemContainer._id,
        },
      }
    );

    return newDepot;
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
