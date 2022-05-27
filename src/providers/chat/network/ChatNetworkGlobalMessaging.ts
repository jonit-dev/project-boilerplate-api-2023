import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ChatLog, IChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { CharacterView } from "@providers/character/CharacterView";
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

@provide(ChatNetworkGlobalMessaging)
export class ChatNetworkGlobalMessaging {
  constructor(
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView,
    private socketTransmissionZone: SocketTransmissionZone
  ) {}

  public onGlobalMessaging(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      ChatSocketEvents.GlobalChatMessageCreate,
      async (data: IChatMessageCreatePayload, character: ICharacter) => {
        try {
          if (this.canCharacterSendMessage(character)) {
            const nearbyCharacters = await this.characterView.getCharactersInView(character as ICharacter);

            await this.saveChatLog(data, character);
            this.sendMessagesToNearbyCharacters(data, character, nearbyCharacters);
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }

  private canCharacterSendMessage(character: ICharacter): Boolean {
    return character.isOnline && !character.isBanned;
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

  private async sendMessagesToNearbyCharacters(
    data: IChatMessageCreatePayload,
    character: ICharacter,
    nearbyCharacters: ICharacter[]
  ): Promise<void> {
    const chatLogs = await this.getChatLogsInZone(character, data.limit);

    for (const nearbyCharacter of nearbyCharacters) {
      const isValidCharacterTarget = this.shouldCharacterReceiveMessage(nearbyCharacter);

      if (isValidCharacterTarget && data.message) {
        this.socketMessaging.sendEventToUser<IChatMessageReadPayload>(
          nearbyCharacter.channelId!,
          ChatSocketEvents.GlobalChatMessageRead,
          chatLogs
        );
      }
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
      .limit(limit);

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