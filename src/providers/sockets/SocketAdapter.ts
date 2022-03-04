// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { provide } from "inversify-binding-decorators";
import { Socket } from "socket.io";
import { GeckosIO } from "./GeckosIO";
import { SocketIO } from "./SocketIO";
import { ISocket, SocketClasses, SocketTypes } from "./SocketsTypes";

@provide(SocketAdapter)
export class SocketAdapter implements ISocket {
  public socket: SocketClasses;

  constructor(private socketIO: SocketIO, private geckosIO: GeckosIO) {}

  public async init(socketType: SocketTypes): Promise<void> {
    switch (socketType as SocketTypes) {
      case SocketTypes.TCP:
        console.log("🔌 Initializing TCP socket...");
        this.socketIO.init();
        this.socket = this.socketIO;
        break;
      case SocketTypes.UDP:
        console.log("🔌 Initializing UDP socket...");
        await this.geckosIO.init();
        this.socket = this.geckosIO;
        break;
    }
  }

  public emitToUser<T>(channel: string, eventName: string, data?: T): void {
    this.socket.emitToUser(channel, eventName, data);
  }

  public emitToAllUsers<T>(eventName: string, data?: T): void {
    this.socket.emitToAllUsers(eventName, data);
  }

  public getChannel(): Socket | ServerChannel {
    return this.socket.channel;
  }
}
