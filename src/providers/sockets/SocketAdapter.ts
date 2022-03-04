// @ts-ignore
import { player } from "@providers/inversify/container";
import { provide } from "inversify-binding-decorators";
import { GeckosIO } from "./GeckosIO";
import { SocketIO } from "./SocketIO";
import { ISocket, SocketClasses, SocketTypes } from "./SocketsTypes";

@provide(SocketAdapter)
export class SocketAdapter implements ISocket {
  public static socketClass: SocketClasses;

  constructor(private socketIO: SocketIO, private geckosIO: GeckosIO) {}

  public async init(socketType: SocketTypes): Promise<void> {
    switch (socketType as SocketTypes) {
      case SocketTypes.TCP:
        console.log("🔌 Initializing TCP socket...");
        this.socketIO.init();
        SocketAdapter.socketClass = this.socketIO;
        break;
      case SocketTypes.UDP:
        console.log("🔌 Initializing UDP socket...");
        await this.geckosIO.init();
        SocketAdapter.socketClass = this.geckosIO;
        break;
    }

    this.onConnect();

    await player.setAllCharactersAsOffline();
  }

  public emitToUser<T>(channel: string, eventName: string, data?: T): void {
    SocketAdapter.socketClass.emitToUser(channel, eventName, data);
  }

  public emitToAllUsers<T>(eventName: string, data?: T): void {
    SocketAdapter.socketClass.emitToAllUsers(eventName, data);
  }

  public onConnect(): void {
    SocketAdapter.socketClass.onConnect((channel) => {
      player.onAddEventListeners(channel);
    });
  }
}
