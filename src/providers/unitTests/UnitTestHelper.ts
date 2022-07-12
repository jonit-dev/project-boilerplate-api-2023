import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { ChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { container } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { BodiesBlueprint } from "@providers/item/data/types/blueprintTypes";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { characterMock } from "@providers/unitTests/mock/characterMock";
import {
  fixedPathMockNPC,
  moveAwayMockNPC,
  moveTowardsMockNPC,
  randomMovementMockNPC,
  stoppedMovementMockNPC,
} from "@providers/unitTests/mock/NPCMock";
import { ISocketTransmissionZone, NPCMovementType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { chatLogsMock } from "./mock/chatLogsMock";
import { itemMock, stackableItemMock } from "./mock/itemMock";

interface IMockCharacterOptions {
  hasEquipment?: boolean;
  hasInventory?: boolean;
  hasSkills?: boolean;
}

interface IMockNPCOptions {
  hasSkills?: boolean;
}

@provide(UnitTestHelper)
export class UnitTestHelper {
  private mongoServer: MongoMemoryServer;

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

  public async createMockItem(extraProps?: Partial<IItem>): Promise<IItem> {
    const newItem = new Item({
      ...itemMock,
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
    await testCharacter.save();

    if (options?.hasSkills) {
      const charSkills = new Skill({
        ownerType: "Character",
      });
      charSkills.owner = testCharacter._id;
      testCharacter.skills = charSkills._id;
      await charSkills.save();
      await testCharacter.save();
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
      await testCharacter.save();
    }
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
