/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { appEnv } from "@providers/config/env";
import { SOCKET_IO_CONFIG } from "@providers/constants/SocketsConstants";
import { SocketIOAuthMiddleware } from "@providers/middlewares/SocketIOAuthMiddleware";
import { EnvType, ISocket } from "@rpg-engine/shared";
import { createAdapter } from "@socket.io/redis-adapter";
import { provide } from "inversify-binding-decorators";
import { createClient } from "redis";
import { Socket, Server as SocketIOServer } from "socket.io";

@provide(SocketIO)
export class SocketIO implements ISocket {
  constructor() {}

  private socket: SocketIOServer;
  public channel: Socket;

  public init(): void {
    this.socket = new SocketIOServer(SOCKET_IO_CONFIG);

    switch (appEnv.general.ENV) {
      case EnvType.Development:
        this.socket.use(SocketIOAuthMiddleware);
        this.socket.listen(appEnv.socket.port.SOCKET);
        break;
      case EnvType.Production:
        const pubClient = createClient({
          socket: {
            host: appEnv.database.REDIS_CONTAINER,
            port: appEnv.database.REDIS_PORT,
          },
        });
        const subClient = pubClient.duplicate();

        this.socket.adapter(createAdapter(pubClient, subClient));

        Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
          this.socket.use(SocketIOAuthMiddleware);
          this.socket.listen(appEnv.socket.port.SOCKET);
        });
        break;
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

  public async disconnect(): Promise<void> {
    console.log("🔌 Shutting down TCP socket connections...");
    await this.socket.close();
  }
}
