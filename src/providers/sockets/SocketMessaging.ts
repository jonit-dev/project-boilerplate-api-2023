// @ts-ignore
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import { appEnv } from "@providers/config/env";
import { NPCView } from "@providers/npc/NPCView";
import { SocketAdapter } from "@providers/sockets/SocketAdapter";
import { EnvType, IUIShowMessage, UIMessageType, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(SocketMessaging)
export class SocketMessaging {
  constructor(private characterView: CharacterView, private npcView: NPCView, private socketAdapter: SocketAdapter) {}

  public sendErrorMessageToCharacter(character: ICharacter, message?: string, type: UIMessageType = "error"): void {
    if (appEnv.general.ENV === EnvType.Development && !appEnv.general.IS_UNIT_TEST) {
      console.log(`✉︎ Error sent to ${character.name}: ${message}`);
    }

    this.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: message ?? "Sorry, not possible.",
      type,
    });
  }

  public sendMessageToCharacter(character: ICharacter, message: string): void {
    this.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: message,
      type: "info",
    });
  }

  public sendEventToUser<T>(userChannel: string, eventName: string, data?: T): void {
    this.socketAdapter.emitToUser(userChannel, eventName, data || {});
  }

  public sendEventToAllUsers<T>(eventName: string, data?: T): void {
    this.socketAdapter.emitToAllUsers(eventName, data || {});
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
