import { socketEventsBinder } from "@providers/inversify/container";
import { ISocket, SocketTypes } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { GeckosIO } from "./GeckosIO";
import { SocketIO } from "./SocketIO";
import { SocketClasses } from "./SocketsTypes";

@provide(SocketAdapter)
export class SocketAdapter implements ISocket {
  public static socketClass: SocketClasses; // Setting this method as static is necessary, otherwise it will be undefined after every injection (state does not persist!);

  constructor(private socketIO: SocketIO, private geckosIO: GeckosIO) {}

  public async init(socketType: SocketTypes): Promise<void> {
    switch (socketType as SocketTypes) {
      case SocketTypes.UDP:
        console.log("🔌 Initializing UDP socket...");
        await this.geckosIO.init();
        SocketAdapter.socketClass = this.geckosIO;
        break;
      case SocketTypes.TCP:
      default:
        console.log("🔌 Initializing TCP socket...");
        this.socketIO.init();
        SocketAdapter.socketClass = this.socketIO;
        break;
    }

    this.onConnect();
  }

  public emitToUser<T>(channel: string, eventName: string, data?: T): void {
    if (data) {
      data = this.applyDataMiddleware(data) as T;
    }

    SocketAdapter.socketClass?.emitToUser(channel, eventName, data);
  }

  public emitToAllUsers<T>(eventName: string, data?: T): void {
    if (data) {
      data = this.applyDataMiddleware(data) as T;
    }

    SocketAdapter.socketClass?.emitToAllUsers(eventName, data);
  }

  public onConnect(): void {
    SocketAdapter.socketClass?.onConnect((channel) => {
      socketEventsBinder.bindEvents(channel);
    });
  }

  public async disconnect(): Promise<void> {
    await SocketAdapter.socketClass?.disconnect();
  }

  private applyDataMiddleware(data: Record<string, any>): Record<string, unknown> {
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        if (key === "_id" || key === "id") {
          data[key] = value.toString();
        }

        if (typeof value === "object") {
          if (value.toObject) {
            data[key] = value.toObject();
          }
        }
      }
    }

    return data;
  }
}
