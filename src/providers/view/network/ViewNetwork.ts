import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { ViewNetworkDestroy } from "./ViewNetworkDestroy";

@provide(ViewNetwork)
export class ViewNetwork {
  constructor(private viewNetworkDestroy: ViewNetworkDestroy) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.viewNetworkDestroy.onViewElementDestroy(channel);
  }
}
