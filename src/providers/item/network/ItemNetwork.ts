import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { ItemNetworkUpdate } from "./ItemNetworkUpdate";

@provide(ItemNetwork)
export class ItemNetwork {
  constructor(private itemNetworkUpdate: ItemNetworkUpdate) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.itemNetworkUpdate.onItemUpdate(channel);
  }
}
