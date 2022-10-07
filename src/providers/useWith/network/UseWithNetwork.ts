import { UseWithItem } from "@providers/useWith/network/UseWithItem";
import { UseWithTile } from "@providers/useWith/network/UseWithTile";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";

@provide(UseWithNetwork)
export class UseWithNetwork {
  constructor(private useWithItem: UseWithItem, private useWithTile: UseWithTile) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.useWithItem.onUseWithItem(channel);
    this.useWithTile.onUseWithTile(channel);
  }
}
