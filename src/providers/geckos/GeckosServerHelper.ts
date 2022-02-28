import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { IUser } from "@entities/ModuleSystem/UserModel";
// @ts-ignore
import { GeckosServer, ServerChannel } from "@geckos.io/server";
import { appEnv } from "@providers/config/env";
import { UnauthorizedError } from "@providers/errors/UnauthorizedError";
import { GeckosAuthMiddleware } from "@providers/middlewares/GeckosAuthMiddleware";
import { EnvType, IConnectedPlayers } from "@rpg-engine/shared";
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

    GeckosServerHelper.io.onConnection((channel) => {
      this.geckosPlayerHelper.onAddEventListeners(channel);
    });
  }

  public authChannelOn<T>(channel: ServerChannel, event: string, callback: (data: T) => void): void {
    channel.on(event, async (data: any) => {
      // check if authenticated user actually owns the character (we'll fetch it from the payload id);
      const user = channel.userData as IUser;
      const character = (await Character.findOne({
        id: data.id,
      })) as ICharacter;

      if (!user.characters?.includes(character.id)) {
        throw new UnauthorizedError("You don't own this character!");
      }

      callback(data);
    });
  }
}
