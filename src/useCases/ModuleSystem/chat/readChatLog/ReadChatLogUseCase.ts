import { ChatLog, IChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { tsDefaultDecorator } from "@providers/constants/ValidationConstants";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { GRID_HEIGHT, GRID_WIDTH, SOCKET_TRANSMISSION_ZONE_WIDTH } from "@rpg-engine/shared";
import { ValidationArguments } from "class-validator";
import { provide } from "inversify-binding-decorators";
import { Model } from "mongoose";

@provide(ReadChatLogUseCase)
export class ReadChatLogUseCase {
  constructor(private socketTransmissionZone: SocketTransmissionZone) {}

  public async getChatLogInZone(chatLogZone): Promise<IChatLog[]> {
    this.validateProperties(chatLogZone);
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
      .limit(Number(chatLogZone.limit));

    chatLogsInView.reverse();
    return chatLogsInView as unknown as IChatLog[];
  }

  private validateProperties(chatLogZone): void {
    const properties = ["x", "y", "scene", "limit"];
    const numberProperties = ["x", "y", "limit"];

    properties.forEach((property) => {
      if (!chatLogZone[property]) {
        throw new BadRequestError(this.getMessageEmpty(property));
      }
      if (numberProperties.includes(property) && !this.isNumber(chatLogZone[property])) {
        throw new BadRequestError(this.getMessageWrongType(property));
      }
    });
  }

  private isNumber(value: any): boolean {
    return !isNaN(parseFloat(value));
  }

  private getMessageEmpty(property: string): string {
    return tsDefaultDecorator("validation", "isNotEmpty").message({ property } as ValidationArguments) as string;
  }

  private getMessageWrongType(property: string): string {
    return tsDefaultDecorator("validation", "isType", { type: "number" }).message({
      property,
    } as ValidationArguments) as string;
  }
}
