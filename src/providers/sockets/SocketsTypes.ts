// @ts-ignore
import { GeckosServer, ServerChannel } from "@geckos.io/server";
import { Server as SocketIOServer, Socket } from "socket.io";
import { GeckosIO } from "./GeckosIO";
import { SocketIO } from "./SocketIO";
export enum SocketTypes {
  TCP = "TCP",
  UDP = "UDP",
}
export interface ISocket {
  init: (socketType?: SocketTypes) => Promise<void> | void;
  onConnect?: (callback) => void;
  emitToUser<T>(channel: string, eventName: string, data?: T);
  emitToAllUsers<T>(eventName: string, data?: T): void;
}

export type SocketServer = SocketIOServer | GeckosServer;

export type SocketClasses = SocketIO | GeckosIO;

export type SocketChannel = Socket | ServerChannel;
