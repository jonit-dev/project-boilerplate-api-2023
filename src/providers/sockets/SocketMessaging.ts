// @ts-ignore
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterView } from "@providers/character/CharacterView";
import { SocketAdapter } from "@providers/sockets/SocketAdapter";
import { provide } from "inversify-binding-decorators";

@provide(SocketMessaging)
export class SocketMessaging {
  constructor(private characterView: CharacterView, private socketAdapter: SocketAdapter) {}

  public sendEventToUser<T>(userChannel: string, eventName: string, data?: T): void {
    try {
      this.socketAdapter.emitToUser(userChannel, eventName, data || {});
    } catch (error) {
      console.error(error);
    }
  }

  public sendEventToAllUsers<T>(eventName: string, data?: T): void {
    try {
      this.socketAdapter.emitToAllUsers(eventName, data || {});
    } catch (error) {
      console.error(error);
    }
  }

  public async sendMessageToCloseCharacters(character: ICharacter, eventName: string, data?: any): Promise<void> {
    const charactersNearby = await this.characterView.getCharactersInView(character);

    if (charactersNearby) {
      for (const character of charactersNearby) {
        console.log(`📨 Sending ${eventName} to ${character.name} (channel: ${character.channelId})`);
        this.sendEventToUser(character.channelId!, eventName, data || {});
      }
    }
  }
}
