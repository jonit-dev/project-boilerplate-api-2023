import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { CharacterView } from "@providers/character/CharacterView";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { ChatMessageType, IChatMessage } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ChatSocketEvents } from "shared/SocketEvents/ChatSocketEvents";

interface ITargetValidation {
  isValid: boolean;
  reason?: string;
}

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
      ChatSocketEvents.MessageToServer,
      async (data: IChatMessage, character: ICharacter) => {
        try {
          if (data.type === ChatMessageType.Global) {
            const nearbyCharacters = await this.characterView.getCharactersInView(character as ICharacter);

            await ChatLog.create({
              message: data.menssage,
              emitter: character._id,
              type: data.type,
              x: character.x,
              y: character.y,
              scene: character.scene,
            });

            for (const nearbyCharacter of nearbyCharacters) {
              const isValidCharacterTarget = this.isValidNPCTarget(nearbyCharacter, character);

              if (isValidCharacterTarget && data.menssage) {
                this.socketMessaging.sendEventToUser<IChatMessage>(
                  character.channelId!,
                  ChatSocketEvents.MessageToClient,
                  {
                    charId: data.charId,
                    menssage: data.menssage,
                    type: data.type,
                  }
                );
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }

  private isValidNPCTarget(target: ICharacter, character: ICharacter): ITargetValidation {
    if (target.scene !== character.scene) {
      return {
        isValid: false,
        reason: "Your target is not on the same scene.",
      };
    }

    const isCharacterOnline = character.isOnline;
    const isCharacterBanned = character.isBanned;

    if (!isCharacterOnline) {
      return {
        isValid: false,
        reason: "Offline targets are not allowed to set target!",
      };
    }

    if (!isCharacterBanned) {
      return {
        isValid: false,
        reason: "Banned characters are not allowed to receive messages!",
      };
    }

    return {
      isValid: true,
    };
  }
}
