import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IUseWithItem, UseWithSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(UseWithItem)
export class UseWithItem {
  constructor(private socketAuth: SocketAuth, private socketMessaging: SocketMessaging) {}

  public onUseWithItem(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, UseWithSocketEvents.UseWithItem, (data: IUseWithItem, character) => {
      try {
        // Check if character is alive and not banned
        if (!character.isAlive) {
          throw new Error(`UseWithItem > Character is dead! Character id: ${character.id}`);
        }

        if (character.isBanned) {
          throw new Error(`UseWithItem > Character is banned! Character id: ${character.id}`);
        }

        if (!character.isOnline) {
          throw new Error(`UseWithItem > Character is offline! Character id: ${character.id}`);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
}
