import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IUser } from "@entities/ModuleSystem/UserModel";
import { CharacterSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { SocketMessaging } from "./SocketMessaging";

@provide(SocketAuth)
export class SocketAuth {
  constructor(private socketMessaging: SocketMessaging) {}

  // this event makes sure that the user who's triggering the request actually owns the character!
  public authCharacterOn(channel, event: string, callback: (data, character: ICharacter, owner: IUser) => void): void {
    try {
      channel.on(event, async (data: any) => {
        // check if authenticated user actually owns the character (we'll fetch it from the payload id);
        const owner = channel.userData || (channel.handshake.query.userData as IUser);
        const character = await Character.findOne({
          _id: data.socketCharId,
          owner: owner.id,
        });

        if (!character) {
          this.socketMessaging.sendEventToUser(channel.id!, CharacterSocketEvents.CharacterForceDisconnect, {
            reason: "You don't own this character!",
          });
          return;
        }

        // console.log(`📨 Received ${event} from ${character.name}(${character._id}): ${JSON.stringify(data)}`);

        callback(data, character, owner);
      });
    } catch (error) {
      console.error(`${event}, channel ${channel} failed with error: ${error}`);
    }
  }
}
