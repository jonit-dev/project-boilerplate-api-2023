import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { ChatNetworkGlobalMessaging } from "./ChatNetworkGlobalMessaging";

@provide(ChatNetwork)
export class ChatNetwork {
  constructor(private chatNetworkGlobalMessaging: ChatNetworkGlobalMessaging) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.chatNetworkGlobalMessaging.onGlobalMessaging(channel);
  }
}
