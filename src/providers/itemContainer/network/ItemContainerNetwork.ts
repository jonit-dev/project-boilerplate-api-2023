import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { ItemContainerOpen } from "./ItemContainerOpen";

@provide(ItemContainerNetwork)
export class ItemContainerNetwork {
  constructor(private itemContainerOpen: ItemContainerOpen) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.itemContainerOpen.onOpen(channel);
    this.itemContainerOpen.onInventoryOpen(channel);
  }
}
