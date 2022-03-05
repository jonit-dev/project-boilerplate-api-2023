import { Character } from "@entities/ModuleSystem/CharacterModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { IPlayerPing, PlayerSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(PlayerPing)
export class PlayerPing {
  constructor(private socketAuth: SocketAuth) {}

  public onPlayerPing(channel: ServerChannel): void {
    this.socketAuth.authCharacterOn(channel, PlayerSocketEvents.PlayerPing, async (data: IPlayerPing) => {
      console.log(`📨 Received ${PlayerSocketEvents.PlayerPing}: ${JSON.stringify(data)}`);

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
