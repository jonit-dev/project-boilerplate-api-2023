import { CharacterSkillBuff } from "@providers/character/CharacterBuffer/CharacterSkillBuff";
import { CharacterConnection } from "@providers/character/CharacterConnection";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { InMemoryRepository } from "@providers/database/InMemoryRepository";
import { RedisManager } from "@providers/database/RedisManager";
import { MapLoader } from "@providers/map/MapLoader";
import { NPCFreezer } from "@providers/npc/NPCFreezer";
import { NPCLoader } from "@providers/npc/NPCLoader";
import { NPCManager } from "@providers/npc/NPCManager";
import { SocketAdapter } from "@providers/sockets/SocketAdapter";
import { SocketEventsBinder } from "@providers/sockets/SocketEventsBinder";
import { UnitTestHelper } from "@providers/unitTests/UnitTestHelper";
import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { Cronjob } from "../cronjobs/CronJobs";
import { Seeder } from "../seeds/Seeder";
import { Database } from "../server/Database";
import { ServerHelper } from "../server/ServerHelper";
import {
  abTestsControllerContainer,
  dbTasksControllerContainer,
  formControllerContainer,
  useCasesControllers,
  userControllerContainer,
} from "./ControllersInversify";

const container = new Container();

container.load(
  buildProviderModule(),
  userControllerContainer,
  dbTasksControllerContainer,
  abTestsControllerContainer,
  formControllerContainer,
  useCasesControllers
);

export const db = container.get<Database>(Database);
export const cronJobs = container.get<Cronjob>(Cronjob);
export const seeds = container.get<Seeder>(Seeder);
export const server = container.get<ServerHelper>(ServerHelper);
export const socketAdapter = container.get<SocketAdapter>(SocketAdapter);

export const mapLoader = container.get<MapLoader>(MapLoader);
export const npcManager = container.get<NPCManager>(NPCManager);
export const npcMetaDataLoader = container.get<NPCLoader>(NPCLoader);
export const unitTestHelper = container.get<UnitTestHelper>(UnitTestHelper);
export const socketEventsBinder = container.get<SocketEventsBinder>(SocketEventsBinder);

export const characterConnection = container.get<CharacterConnection>(CharacterConnection);
export const characterInventory = container.get<CharacterInventory>(CharacterInventory);

export const redisManager = container.get<RedisManager>(RedisManager);

export const npcFreezer = container.get<NPCFreezer>(NPCFreezer);

export const characterSkillBuff = container.get<CharacterSkillBuff>(CharacterSkillBuff);

export const inMemoryRepository = container.get<InMemoryRepository>(InMemoryRepository);

export { container };
