import { Character } from "@entities/ModuleSystem/CharacterModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { CharacterSocketEvents, ICharacterPing } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(CharacterNetworkPing)
export class CharacterNetworkPing {
  constructor(private socketAuth: SocketAuth) {}

  public onCharacterPing(channel: ServerChannel): void {
    this.socketAuth.authCharacterOn(channel, CharacterSocketEvents.CharacterPing, async (data: ICharacterPing) => {
      console.log(`📨 Received ${CharacterSocketEvents.CharacterPing}: ${JSON.stringify(data)}`);

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
