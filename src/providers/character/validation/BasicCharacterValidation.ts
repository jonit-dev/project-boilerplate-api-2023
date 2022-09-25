import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IUIShowMessage, UIMessageType, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(BasicCharacterValidation)
export class BasicCharacterValidation {
  constructor(private socketMessaging: SocketMessaging) {}

  public isCharacterValid(character: ICharacter): boolean {
    if (character.isBanned) {
      this.sendCustomErrorMessage(character, "Sorry, you are banned and can't drop this item.");
      return false;
    }

    if (!character.isOnline) {
      this.sendCustomErrorMessage(character, "Sorry, you must be online to drop this item.");
      return false;
    }

    return true;
  }

  public sendCustomErrorMessage(character: ICharacter, message: string, type: UIMessageType = "error"): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message,
      type,
    });
  }
}
