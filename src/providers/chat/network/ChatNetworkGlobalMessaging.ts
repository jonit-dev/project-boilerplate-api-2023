import { profanity } from "@2toad/profanity";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterView } from "@providers/character/CharacterView";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { SpellCast } from "@providers/spells/SpellCast";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";
import {
  ChatMessageType,
  ChatSocketEvents,
  GRID_HEIGHT,
  GRID_WIDTH,
  IChatMessageCreatePayload,
  IChatMessageReadPayload,
  SOCKET_TRANSMISSION_ZONE_WIDTH,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ChatNetworkGlobalMessaging)
export class ChatNetworkGlobalMessaging {
  constructor(
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView,
    private socketTransmissionZone: SocketTransmissionZone,
    private spellCast: SpellCast,
    private characterValidation: CharacterValidation,
    private newRelic: NewRelic,
    private characterRepository: CharacterRepository
  ) {}

  public onGlobalMessaging(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      ChatSocketEvents.GlobalChatMessageCreate,
      async (data: IChatMessageCreatePayload, character: ICharacter) => {
        await this.newRelic.trackTransaction(
          NewRelicTransactionCategory.Operation,
          "ChatNetworkGlobalMessaging.onGlobalMessaging",
          async () => {
            try {
              const canChat = this.characterValidation.hasBasicValidation(character);

              if (!canChat) {
                return;
              }

              if (this.spellCast.isSpellCasting(data.message)) {
                const spellCharacter = (await this.characterRepository.findById(character._id, {
                  leanType: "no-lean",
                })) as ICharacter;

                await this.spellCast.castSpell({ magicWords: data.message }, spellCharacter);
              }

              const nearbyCharacters = await this.characterView.getCharactersInView(character as ICharacter);

              if (data.message.length >= 200) {
                this.socketMessaging.sendErrorMessageToCharacter(
                  character,
                  "Chat message is too long, maximum is 200 characters"
                );
                return;
              }

              if (data.message.length > 0) {
                // If the message contains profanity, replace it with asterisks except the first letter
                data = this.replaceProfanity(data);

                const chatLog = new ChatLog({
                  message: data.message,
                  emitter: character._id,
                  type: data.type,
                  x: character.x,
                  y: character.y,
                  scene: character.scene,
                });

                await chatLog.save();

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
    );
  }

  private replaceProfanity<T>(data): T {
    if (profanity.exists(data.message)) {
      const words = data.message.split(" ");
      for (let i = 0; i < words.length; i++) {
        if (profanity.exists(words[i])) {
          words[i] = words[i][0] + words[i].substring(1).replace(/[^\s]/g, "*");
        }
      }
      data.message = words.join(" ");
    }

    return data;
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

    const chatLogsInView = await ChatLog.find({
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
      .limit(limit);

    chatLogsInView.reverse();

    if (!chatLogsInView.length) {
      return {
        messages: [],
      };
    }

    const chatLogs = chatLogsInView.map((chatLog) => {
      const emitter = chatLog.emitter as unknown as ICharacter;

      return {
        _id: chatLog._id,
        message: chatLog.message,
        emitter: {
          _id: emitter._id as string,
          name: emitter.name,
        },
        type: chatLog.type as ChatMessageType,
      };
    });

    return {
      messages: chatLogs,
    };
  }

  private shouldCharacterReceiveMessage(target: ICharacter): Boolean {
    return target.isOnline && !target.isBanned;
  }
}
