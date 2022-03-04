import { Character } from "@entities/ModuleSystem/CharacterModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { IPlayerPing, PlayerGeckosEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(PlayerPing)
export class PlayerPing {
  constructor(private socketAuth: SocketAuth) {}

  public onPlayerPing(channel: ServerChannel): void {
    this.socketAuth.authCharacterOn(channel, PlayerGeckosEvents.PlayerPing, async (data: IPlayerPing) => {
      console.log(`📨 Received ${PlayerGeckosEvents.PlayerPing}: ${JSON.stringify(data)}`);

      await Character.updateOne(
        {
          _id: data.id,
        },
        {
          $set: {
            updatedAt: new Date(),
          },
        }
      );
    });
  }
}
