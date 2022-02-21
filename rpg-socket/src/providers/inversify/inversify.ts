import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { CronsManager } from "../crons/CronsManager";

const container = new Container();
container.load(buildProviderModule());

export const cronsManager = container.get<CronsManager>(CronsManager);

export { container };
