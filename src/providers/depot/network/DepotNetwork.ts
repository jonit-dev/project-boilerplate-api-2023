import { DepotNetworkOpen } from "@providers/depot/network/DepotNetworkOpen";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";

@provide(DepotNetwork)
export class DepotNetwork {
  constructor(private depotNetworkOpen: DepotNetworkOpen) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.depotNetworkOpen.onDepotContainerOpen(channel);
  }
}
