import { ChatLog, IChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { GRID_HEIGHT, GRID_WIDTH, SOCKET_TRANSMISSION_ZONE_WIDTH } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Model } from "mongoose";
import { ChatLogDTO } from "../ChatLogDTO";

@provide(ReadChatLogUseCase)
export class ReadChatLogUseCase {
  constructor(private socketTransmissionZone: SocketTransmissionZone) {}

  public async getChatLogInZone(chatLogDTO: ChatLogDTO): Promise<IChatLog[]> {
    const socketTransmissionZone = this.socketTransmissionZone.calculateSocketTransmissionZone(
      chatLogDTO.x,
      chatLogDTO.y,
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
            scene: chatLogDTO.scene,
          },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(chatLogDTO.limit);
    chatLogsInView.reverse();
    return chatLogsInView as unknown as IChatLog[];
  }
}
