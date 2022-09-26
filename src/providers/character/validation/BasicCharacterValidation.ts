import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IUIShowMessage, UIMessageType, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(BasicCharacterValidation)
export class BasicCharacterValidation {
  constructor(private socketMessaging: SocketMessaging) {}

  public isCharacterValid(character: ICharacter): boolean {
    if (!character.isAlive) {
      this.sendCustomErrorMessage(character, "Sorry, you are dead.");
      return false;
    }

    if (character.isBanned) {
      this.sendCustomErrorMessage(character, "Sorry, you are banned.");
      return false;
    }

    if (!character.isOnline) {
      this.sendCustomErrorMessage(character, "Sorry, you are not online.");
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
