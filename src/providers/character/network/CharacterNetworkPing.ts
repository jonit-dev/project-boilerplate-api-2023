import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { CharacterSocketEvents, ICharacterPing } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(CharacterNetworkPing)
export class CharacterNetworkPing {
  constructor(private socketAuth: SocketAuth) {}

  public onCharacterPing(channel: SocketChannel): void {
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
