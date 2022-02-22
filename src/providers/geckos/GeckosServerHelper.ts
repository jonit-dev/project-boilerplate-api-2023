// @ts-ignore
import { GeckosServer } from "@geckos.io/server";
import { EnvType } from "@project-remote-job-board/shared/dist";
import { appEnv } from "@providers/config/env";
import { IConnectedPlayers } from "@rpg-engine/shared";
import { Server } from "http";
import { provide } from "inversify-binding-decorators";
import { Player } from "../Player/Player";

@provide(GeckosServerHelper)
export class GeckosServerHelper {
  public static io: GeckosServer;

  constructor(private geckosPlayerHelper: Player) {}

  public static connectedPlayers: IConnectedPlayers = {};

  public async init(httpServer: Server): Promise<void> {
    // import geckos as ESM
    const { geckos } = await import("@geckos.io/server");

    switch (appEnv.general.ENV) {
      case EnvType.Development:
        GeckosServerHelper.io = geckos({
          portRange: {
            min: 20000,
            max: 20005,
          },
        });
        GeckosServerHelper.io.addServer(httpServer);
        GeckosServerHelper.io.listen(appEnv.port.SOCKET);

        break;
      case EnvType.Staging:
      case EnvType.Production:
        GeckosServerHelper.io = geckos({
          portRange: {
            min: 20000,
            max: 20100,
          },
        });
        GeckosServerHelper.io.addServer(httpServer);

        // This will make sure geckos listen on multiple ports, according to the number of pm2 instances.
        //! Regardless, it will only listen on the first port (5101), since Geckos does not have support for clusters yet! This hack is only made to make it work.
        GeckosServerHelper.io.listen(appEnv.port.SOCKET + Number(process.env.NODE_APP_INSTANCE));
        break;
    }

    GeckosServerHelper.io.onConnection((channel) => {
      this.geckosPlayerHelper.onAddEventListeners(channel);
    });
  }
}
