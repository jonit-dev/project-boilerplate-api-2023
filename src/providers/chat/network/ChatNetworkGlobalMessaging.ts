import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ChatLog, IChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterView } from "@providers/character/CharacterView";
import { SpellCast } from "@providers/spells/SpellCast";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import {
  ChatSocketEvents,
  GRID_HEIGHT,
  GRID_WIDTH,
  IChatMessageCreatePayload,
  IChatMessageReadPayload,
  SOCKET_TRANSMISSION_ZONE_WIDTH,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Model } from "mongoose";
import { profanity } from "@2toad/profanity";

@provide(ChatNetworkGlobalMessaging)
export class ChatNetworkGlobalMessaging {
  constructor(
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView,
    private socketTransmissionZone: SocketTransmissionZone,
    private spellCast: SpellCast,
    private characterValidation: CharacterValidation
  ) {}

  public onGlobalMessaging(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      ChatSocketEvents.GlobalChatMessageCreate,
      async (data: IChatMessageCreatePayload, character: ICharacter) => {
        try {
          const canChat = this.characterValidation.hasBasicValidation(character);

          if (!canChat) {
            return;
          }

          if (this.spellCast.isSpellCasting(data.message)) {
            await this.spellCast.castSpell(data.message, character);
          }

          const nearbyCharacters = await this.characterView.getCharactersInView(character as ICharacter);

          if (data.message.length > 0) {
            // If the message contains profanity, replace it with asterisks except the first letter
            if (profanity.exists(data.message)) {
              const words = data.message.split(" ");
              for (let i = 0; i < words.length; i++) {
                if (profanity.exists(words[i])) {
                  words[i] = words[i][0] + words[i].substring(1).replace(/[^\s]/g, "*");
                }
              }
              data.message = words.join(" ");
            }

            await this.saveChatLog(data, character);
            const chatLogs = await this.getChatLogsInZone(character, data.limit);

            this.sendMessagesToNearbyCharacters(chatLogs, nearbyCharacters);
            this.sendMessagesToCharacter(chatLogs, character);
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }

  private async saveChatLog(data: IChatMessageCreatePayload, character: ICharacter): Promise<IChatLog> {
    return await ChatLog.create({
      message: data.message,
      emitter: character._id,
      type: data.type,
      x: character.x,
      y: character.y,
      scene: character.scene,
    });
  }

  private sendMessagesToNearbyCharacters(chatLogs: IChatMessageReadPayload, nearbyCharacters: ICharacter[]): void {
    for (const nearbyCharacter of nearbyCharacters) {
      const isValidCharacterTarget = this.shouldCharacterReceiveMessage(nearbyCharacter);

      if (isValidCharacterTarget) {
        this.socketMessaging.sendEventToUser<IChatMessageReadPayload>(
          nearbyCharacter.channelId!,
          ChatSocketEvents.GlobalChatMessageRead,
          chatLogs
        );
      }
    }
  }

  private sendMessagesToCharacter(chatLogs: IChatMessageReadPayload, character: ICharacter): void {
    const isValidCharacterTarget = this.shouldCharacterReceiveMessage(character);

    if (isValidCharacterTarget) {
      this.socketMessaging.sendEventToUser<IChatMessageReadPayload>(
        character.channelId!,
        ChatSocketEvents.GlobalChatMessageRead,
        chatLogs
      );
    }
  }

  public async getChatLogsInZone(character: ICharacter, limit: number = 20): Promise<IChatMessageReadPayload> {
    const socketTransmissionZone = this.socketTransmissionZone.calculateSocketTransmissionZone(
      character.x,
      character.y,
      GRID_WIDTH,
      GRID_HEIGHT,
      SOCKET_TRANSMISSION_ZONE_WIDTH,
      SOCKET_TRANSMISSION_ZONE_WIDTH
    );

    // @ts-ignore
    const chatLogsInView = await (ChatLog as Model)
      .find({
        $and: [
          {
            x: {
              $gte: socketTransmissionZone.x,
              $lte: socketTransmissionZone.width,
            },
          },
          {
            y: {
              $gte: socketTransmissionZone.y,
              $lte: socketTransmissionZone.height,
            },
          },
          {
            scene: character.scene,
          },
        ],
      })
      .sort({ createdAt: -1 })
      .populate("emitter", "name")
      .limit(limit)
      .lean({ virtuals: true, defaults: true });

    chatLogsInView.reverse();

    const chatMessageReadPayload: IChatMessageReadPayload = {
      messages: chatLogsInView,
    };

    return chatMessageReadPayload;
  }

  private shouldCharacterReceiveMessage(target: ICharacter): Boolean {
    return target.isOnline && !target.isBanned;
  }
}
