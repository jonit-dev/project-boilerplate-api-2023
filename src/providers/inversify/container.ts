import { Player } from "@providers/player/Player";
import { SocketAdapter } from "@providers/sockets/SocketAdapter";
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
export const player = container.get<Player>(Player);

export { container };
