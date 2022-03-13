import { appEnv } from "@providers/config/env";
import { SOCKET_IO_CONFIG } from "@providers/constants/SocketsConstants";
import { SocketIOAuthMiddleware } from "@providers/middlewares/SocketIOAuthMiddleware";
import { EnvType, ISocket } from "@rpg-engine/shared";
import { createAdapter } from "@socket.io/cluster-adapter";
import { setupWorker } from "@socket.io/sticky";
import { provide } from "inversify-binding-decorators";
import { Server as SocketIOServer, Socket } from "socket.io";

@provide(SocketIO)
export class SocketIO implements ISocket {
  constructor() {}

  private socket: SocketIOServer;
  public channel: Socket;

  public init(): void {
    this.socket = new SocketIOServer(SOCKET_IO_CONFIG);
    this.socket.use(SocketIOAuthMiddleware);
    this.socket.listen(appEnv.socket.port.SOCKET);

    if (appEnv.general.ENV === EnvType.Production) {
      this.socket.adapter(createAdapter());
      setupWorker(this.socket);
    }
  }

  public emitToUser<T>(channel: string, eventName: string, data?: T): void {
    this.socket.to(channel).emit(eventName, data || {});
  }

  public emitToAllUsers<T>(eventName: string, data?: T): void {
    this.socket.emit(eventName, data || {});
  }

  public onConnect(onConnectFn: (channel) => void): void {
    this.socket.on("connection", (channel) => {
      onConnectFn(channel);
    });
  }
}
