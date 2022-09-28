import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSocketEvents, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

interface IBaseValidationErrorMessages {
  isOnline?: string;
  isAlive?: string;
}

@provide(CharacterValidation)
export class CharacterValidation {
  constructor(private socketMessaging: SocketMessaging) {}

  public hasBasicValidation(character: ICharacter, errorMessages?: IBaseValidationErrorMessages): boolean {
    if (!character.isOnline) {
      if (errorMessages?.isOnline) {
        this.socketMessaging.sendEventToUser(character.channelId!, UISocketEvents.ShowMessage, {
          message: errorMessages.isOnline || "You are offline and cannot perform this action!",
          type: "error",
        });
      }

      return false;
    }

    if (!character.isAlive) {
      if (errorMessages?.isAlive) {
        this.socketMessaging.sendEventToUser(character.channelId!, UISocketEvents.ShowMessage, {
          message: errorMessages.isAlive || "You are dead and cannot perform this action!",
          type: "error",
        });
      }

      return false;
    }

    if (character.isBanned) {
      this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.CharacterForceDisconnect, {
        reason: "You cannot use this character while banned.",
      });

      return false;
    }

    return true;
  }
}
