import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { IUser } from "@entities/ModuleSystem/UserModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { provide } from "inversify-binding-decorators";

@provide(GeckosAuth)
export class GeckosAuth {
  // this event makes sure that the user who's triggering the request actually owns the character!
  public authCharacterOn(
    channel: ServerChannel,
    event: string,
    callback: (data, character: ICharacter, owner: IUser) => void
  ): void {
    try {
      channel.on(event, async (data: any) => {
        // check if authenticated user actually owns the character (we'll fetch it from the payload id);
        const owner = channel.userData as IUser;
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
