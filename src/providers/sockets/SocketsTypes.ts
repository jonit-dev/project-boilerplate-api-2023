// @ts-ignore
import { GeckosServer, ServerChannel } from "@geckos.io/server";
import { Server as SocketIOServer, Socket } from "socket.io";
import { GeckosIO } from "./GeckosIO";
import { SocketIO } from "./SocketIO";

export type SocketServer = SocketIOServer | GeckosServer;

export type SocketClasses = SocketIO | GeckosIO;

export type SocketChannel = Socket | ServerChannel;
