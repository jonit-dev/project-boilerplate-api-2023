// @ts-ignore
import { ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { CharacterView } from "@providers/character/CharacterView";
import { MathHelper } from "@providers/math/MathHelper";
import { SocketAdapter } from "@providers/sockets/SocketAdapter";
import { provide } from "inversify-binding-decorators";

@provide(SocketMessaging)
export class SocketMessaging {
  constructor(
    private mathHelper: MathHelper,
    private characterView: CharacterView,
    private socketAdapter: SocketAdapter
  ) {}

  public sendEventToUser<T>(userChannel: string, eventName: string, data?: T): void {
    this.socketAdapter.emitToUser(userChannel, eventName, data || {});
  }

  public sendEventToAllUsers<T>(eventName: string, data?: T): void {
    this.socketAdapter.emitToAllUsers(eventName, data || {});
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
