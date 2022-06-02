import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { ItemNetworkInfo } from "./ItemNetworkInfo";
import { ItemNetworkUpdate } from "./ItemNetworkUpdate";

@provide(ItemNetwork)
export class ItemNetwork {
  constructor(private itemNetworkUpdate: ItemNetworkUpdate, private itemNetworkInfo: ItemNetworkInfo) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.itemNetworkUpdate.onItemUpdate(channel);
    this.itemNetworkInfo.onGetItemInfo(channel);
  }
}
