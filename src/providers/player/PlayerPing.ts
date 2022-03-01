import { Character } from "@entities/ModuleSystem/CharacterModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { GeckosAuth } from "@providers/geckos/GeckosAuth";
import { IPlayerPing, PlayerGeckosEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(PlayerPing)
export class PlayerPing {
  constructor(private geckosAuth: GeckosAuth) {}

  public onPlayerPing(channel: ServerChannel): void {
    this.geckosAuth.authCharacterOn(channel, PlayerGeckosEvents.PlayerPing, async (data: IPlayerPing) => {
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
