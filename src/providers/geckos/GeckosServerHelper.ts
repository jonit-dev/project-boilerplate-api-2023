// @ts-ignore
import { GeckosServer } from "@geckos.io/server";
import { appEnv } from "@providers/config/env";
import { GeckosAuthMiddleware } from "@providers/middlewares/GeckosAuthMiddleware";
import { EnvType, IConnectedPlayers } from "@rpg-engine/shared";
import { Server } from "http";
import { provide } from "inversify-binding-decorators";
import { Player } from "../player/Player";

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
          authorization: GeckosAuthMiddleware,
          cors: {
            origin: "*",
            allowAuthorization: true,
          }, // required if the client and server are on separate domains
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
          authorization: GeckosAuthMiddleware,
          cors: {
            origin: "*",
            allowAuthorization: true,
          }, // required if the client and server are on separate domains
        });
        GeckosServerHelper.io.addServer(httpServer);

        // This will make sure geckos listen on multiple ports, according to the number of pm2 instances.
        //! Regardless, it will only listen on the first port (5101), since Geckos does not have support for clusters yet! This hack is only made to make it work.
        //! Discussion: https://github.com/geckosio/geckos.io/discussions/178
        GeckosServerHelper.io.listen(appEnv.port.SOCKET + Number(process.env.NODE_APP_INSTANCE));
        break;
    }

    await this.geckosPlayerHelper.setAllCharactersAsOffline();

    GeckosServerHelper.io.onConnection(async (channel) => {
      await this.geckosPlayerHelper.onAddEventListeners(channel);
    });
  }
}
