import { ChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { GRID_HEIGHT, GRID_WIDTH, IChatMessage, SOCKET_TRANSMISSION_ZONE_WIDTH } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Model } from "mongoose";

@provide(ReadChatLogUseCase)
export class ReadChatLogUseCase {
  constructor(private socketTransmissionZone: SocketTransmissionZone) {}

  public async getChatLogInZone(chatLogZone): Promise<IChatMessage[]> {
    const socketTransmissionZone = this.socketTransmissionZone.calculateSocketTransmissionZone(
      chatLogZone.x,
      chatLogZone.y,
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
            scene: chatLogZone.scene,
          },
        ],
      })
      .sort({ createdAt: -1 })
      .populate("emitter", "name")
      .limit(Number(chatLogZone.limit))
      .lean({ virtuals: true, defaults: true });

    chatLogsInView.reverse();
    return chatLogsInView as unknown as IChatMessage[];
  }

  private isNumber(value: any): boolean {
    return !isNaN(parseFloat(value));
  }
}
