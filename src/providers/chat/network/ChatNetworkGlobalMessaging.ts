import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { CharacterView } from "@providers/character/CharacterView";
import { ChatSocketEvents } from "@providers/shared/SocketEvents/ChatSocketEvents";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IChatMessage } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ChatNetworkGlobalMessaging)
export class ChatNetworkGlobalMessaging {
  constructor(
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView
  ) {}

  public onGlobalMessaging(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      ChatSocketEvents.GlobalChatMessage,
      async (data: IChatMessage, character: ICharacter) => {
        try {
          const nearbyCharacters = await this.characterView.getCharactersInView(character as ICharacter);

          await this.saveChatLog(data, character);

          for (const nearbyCharacter of nearbyCharacters) {
            const isValidCharacterTarget = this.shouldCharacterReceiveMessage(nearbyCharacter, character);

            if (isValidCharacterTarget && data.message) {
              this.socketMessaging.sendEventToUser<IChatMessage>(
                character.channelId!,
                ChatSocketEvents.GlobalChatMessage,
                {
                  charId: data.charId,
                  message: data.message,
                  type: data.type,
                }
              );
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }

  private async saveChatLog(data: IChatMessage, character: ICharacter): Promise<void> {
    await ChatLog.create({
      message: data.message,
      emitter: character._id,
      type: data.type,
      x: character.x,
      y: character.y,
      scene: character.scene,
    });
  }

  private shouldCharacterReceiveMessage(target: ICharacter, emitter: ICharacter): Boolean {
    if (target.scene !== emitter.scene) {
      return false;
    }

    return target.isOnline && !target.isBanned;
  }
}
