// @ts-ignore
import { Data, GeckosServer } from "@geckos.io/server";
import { appEnv } from "@providers/config/env";
import { GECKOS_CONFIG } from "@providers/constants/SocketsConstants";
import { EnvType, ISocket } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(GeckosIO)
export class GeckosIO implements ISocket {
  private socket: GeckosServer;

  constructor() {}

  public async init(): Promise<void> {
    // @ts-ignore
    const { geckos } = await import("@geckos.io/server");

    this.socket = geckos(GECKOS_CONFIG);

    switch (appEnv.general.ENV) {
      case EnvType.Development:
        this.socket.listen(appEnv.socket.port.SOCKET);
        break;
      case EnvType.Staging:
      case EnvType.Production:
        this.socket.listen(appEnv.socket.port.SOCKET + Number(process.env.NODE_APP_INSTANCE));
        break;
    }
  }

  public emitToUser<T>(channel: string, eventName: string, data?: T): void {
    return this.socket.room(channel).emit(eventName, (data || {}) as Data);
  }

  public emitToAllUsers<T>(eventName: string, data?: T): void {
    return this.socket.emit(eventName, (data || {}) as Data);
  }

  public onConnect(onConnectFn: (channel) => void): void {
    this.socket.onConnection((channel) => {
      onConnectFn(channel);
    });
  }

  public async disconnect(): Promise<void> {
    console.log("🔌 Shutting down UDP socket connections...");

    const connections = this.socket.connectionsManager.getConnections();

    for (const [channelId, webRTCConnection] of connections) {
      await this.socket.connectionsManager.deleteConnection(webRTCConnection, channelId!);
    }
  }

  public getChannelById(channelId: string): any {
    return this.socket.room(channelId);
  }
}
