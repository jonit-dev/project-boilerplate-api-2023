// @ts-ignore
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import { NPCView } from "@providers/npc/NPCView";
import { SocketAdapter } from "@providers/sockets/SocketAdapter";
import { IUIShowMessage, UIMessageType, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(SocketMessaging)
export class SocketMessaging {
  constructor(private characterView: CharacterView, private npcView: NPCView, private socketAdapter: SocketAdapter) {}

  public sendErrorMessageToCharacter(character: ICharacter, message?: string, type: UIMessageType = "error"): void {
    console.log(message);
    this.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: message || "Sorry, something went wrong.",
      type,
    });
  }

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

  public async sendEventToCharactersAroundCharacter<T>(
    character: ICharacter,
    eventName: string,
    data?: T
  ): Promise<void> {
    const charactersNearby = await this.characterView.getCharactersInView(character);

    if (charactersNearby) {
      for (const character of charactersNearby) {
        this.sendEventToUser<T>(character.channelId!, eventName, data || ({} as T));
      }
    }
  }

  public async sendEventToCharactersAroundNPC<T>(npc: INPC, eventName: string, data?: T): Promise<void> {
    const charactersNearby = await this.npcView.getCharactersInView(npc);

    if (charactersNearby) {
      for (const character of charactersNearby) {
        this.sendEventToUser<T>(character.channelId!, eventName, data || ({} as T));
      }
    }
  }
}
