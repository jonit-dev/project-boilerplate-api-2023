import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { ItemNetworkInfo } from "./ItemNetworkInfo";
import { ItemNetworkUpdate } from "./ItemNetworkUpdate";
import { ItemNetworkPickup } from "./ItemNetworkPickup";
import { ItemNetworkDrop } from "./ItemNetworkDrop";

@provide(ItemNetwork)
export class ItemNetwork {
  constructor(
    private itemNetworkUpdate: ItemNetworkUpdate,
    private itemNetworkInfo: ItemNetworkInfo,
    private itemNetworkPickup: ItemNetworkPickup,
    private itemNetworkDrop: ItemNetworkDrop
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.itemNetworkUpdate.onItemUpdate(channel);
    this.itemNetworkInfo.onGetItemInfo(channel);
    this.itemNetworkPickup.onItemPickup(channel);
    this.itemNetworkDrop.onItemDrop(channel);
  }
}
