import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IUser } from "@entities/ModuleSystem/UserModel";
import { provide } from "inversify-binding-decorators";

@provide(SocketAuth)
export class SocketAuth {
  // this event makes sure that the user who's triggering the request actually owns the character!
  public authCharacterOn(channel, event: string, callback: (data, character: ICharacter, owner: IUser) => void): void {
    try {
      channel.on(event, async (data: any) => {
        // check if authenticated user actually owns the character (we'll fetch it from the payload id);
        const owner = channel.userData || (channel.handshake.query.userData as IUser);
        const character = await Character.findOne({
          _id: data.id,
          owner: owner.id,
        });

        if (!character) {
          console.log("You don't own this character!");
          return;
        }

        callback(data, character, owner);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
