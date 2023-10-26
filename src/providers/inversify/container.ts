import { NewRelic } from "@providers/analytics/NewRelic";

import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { RedisManager } from "@providers/database/RedisManager/RedisManager";
import { HashGenerator } from "@providers/hash/HashGenerator";
import { Locker } from "@providers/locks/Locker";

import { PM2Helper } from "@providers/server/PM2Helper";
import { ServerBootstrap } from "@providers/server/ServerBootstrap";
import { SocketAdapter } from "@providers/sockets/SocketAdapter";
import { SocketEventsBinder } from "@providers/sockets/SocketEventsBinder";
import { SocketEventsBinderControl } from "@providers/sockets/SocketEventsBinderControl";

import { LinearInterpolation } from "@providers/math/LinearInterpolation";
import { MathHelper } from "@providers/math/MathHelper";
import { NumberFormatter } from "@providers/text/NumberFormatter";
import { TextFormatter } from "@providers/text/TextFormatter";
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

export const database = container.get<Database>(Database);
export const cronJobs = container.get<Cronjob>(Cronjob);
export const seeds = container.get<Seeder>(Seeder);
export const serverHelper = container.get<ServerHelper>(ServerHelper);
export const socketAdapter = container.get<SocketAdapter>(SocketAdapter);

export const unitTestHelper = container.get<UnitTestHelper>(UnitTestHelper);
export const socketEventsBinder = container.get<SocketEventsBinder>(SocketEventsBinder);

export const socketEventsBinderControl = container.get<SocketEventsBinderControl>(SocketEventsBinderControl);

export const redisManager = container.get<RedisManager>(RedisManager);

export const inMemoryHashTable = container.get<InMemoryHashTable>(InMemoryHashTable);

export const pm2Helper = container.get<PM2Helper>(PM2Helper);

export const serverBootstrap = container.get<ServerBootstrap>(ServerBootstrap);

export const newRelic = container.get<NewRelic>(NewRelic);

export const hashGenerator = container.get<HashGenerator>(HashGenerator);

export const locker = container.get<Locker>(Locker);

export const linearInterpolation = container.get<LinearInterpolation>(LinearInterpolation);

export const textFormatter = container.get<TextFormatter>(TextFormatter);

export const numberFormatter = container.get<NumberFormatter>(NumberFormatter);

export const mathHelper = container.get<MathHelper>(MathHelper);

export { container };
