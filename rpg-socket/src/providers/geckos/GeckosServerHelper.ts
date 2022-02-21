// @ts-ignore
import { GeckosServer } from "@geckos.io/server";
import { IConnectedPlayers } from "@rpg-engine/shared";
import { Server } from "http";
import { provide } from "inversify-binding-decorators";
import { appEnv } from "../constants/env";
import { Player } from "../Player/Player";

@provide(GeckosServerHelper)
export class GeckosServerHelper {
  public static io: GeckosServer;

  constructor(private geckosPlayerHelper: Player) {}

  public static connectedPlayers: IConnectedPlayers = {};

  public async init(httpServer: Server): Promise<void> {
    // import geckos as ESM
    const { geckos } = await import("@geckos.io/server");

    switch (appEnv.ENV) {
      case "Development":
        GeckosServerHelper.io = geckos({
          portRange: {
            min: 20000,
            max: 20005,
          },
        });
        break;
      case "Production":
        GeckosServerHelper.io = geckos({
          portRange: {
            min: 20000,
            max: 20100,
          },
        });
        break;
    }

    GeckosServerHelper.io.addServer(httpServer);
    GeckosServerHelper.io.listen(appEnv.port.socket);
    GeckosServerHelper.io.onConnection((channel) => {
      this.geckosPlayerHelper.onAddEventListeners(channel);
    });
  }
}
