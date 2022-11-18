import { UseWithItem } from "@providers/useWith/network/UseWithItem";
import { UseWithTile } from "@providers/useWith/network/UseWithTile";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { UseWithEntityNetwork } from "./UseWithEntityNetwork";

@provide(UseWithNetwork)
export class UseWithNetwork {
  constructor(
    private useWithItem: UseWithItem,
    private useWithTile: UseWithTile,
    private useWithEntity: UseWithEntityNetwork
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.useWithItem.onUseWithItem(channel);
    this.useWithTile.onUseWithTile(channel);
    this.useWithEntity.onUseWithEntity(channel);
  }
}
