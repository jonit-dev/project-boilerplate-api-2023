import { Character } from "@entities/ModuleSystem/CharacterModel";
import { IUser } from "@entities/ModuleSystem/UserModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { UnauthorizedError } from "@providers/errors/UnauthorizedError";
import { ICharacter } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(GeckosAuth)
export class GeckosAuth {
  // this event makes sure that the user who's triggering the request actually owns the character!
  public authCharacterOn<T>(channel: ServerChannel, event: string, callback: (data: T) => void): void {
    channel.on(event, async (data: any) => {
      // check if authenticated user actually owns the character (we'll fetch it from the payload id);
      const user = channel.userData as IUser;
      const character = (await Character.findOne({
        _id: data.id,
        owner: user.id,
      })) as unknown as ICharacter;

      if (!character) {
        throw new UnauthorizedError("You don't own this character!");
      }

      data.owner = user.id;
      data.character = character;

      callback(data);
    });
  }
}
