// @ts-ignore
import { GeckosServer, ServerChannel } from "@geckos.io/server";
import { appEnv } from "@providers/config/env";
import { GECKOS_CONFIG } from "@providers/constants/SocketsConstants";
import { EnvType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ISocket } from "./SocketsTypes";

@provide(GeckosIO)
export class GeckosIO implements ISocket {
  private socket: GeckosServer;
  public channel: ServerChannel;

  constructor() {}

  public async init(): Promise<void> {
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
    return this.socket.room(channel).emit(eventName, data || {});
  }

  public emitToAllUsers<T>(eventName: string, data?: T): void {
    return this.socket.emit(eventName, data || {});
  }

  public onConnect(onConnectFn: (channel: ServerChannel) => void): void {
    this.socket.onConnection((channel) => {
      onConnectFn(channel);
    });
  }
}
