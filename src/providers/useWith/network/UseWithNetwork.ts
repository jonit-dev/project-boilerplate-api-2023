import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { UseWithItem } from "@providers/useWith/UseWithItem";
import { UseWithTile } from "@providers/useWith/UseWithTile";
import { provide } from "inversify-binding-decorators";
import { UseWithEntity } from "../UseWithEntity";

@provide(UseWithNetwork)
export class UseWithNetwork {
  constructor(
    private useWithItem: UseWithItem,
    private useWithTile: UseWithTile,
    private useWithEntity: UseWithEntity
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.useWithItem.onUseWithItem(channel);
    this.useWithTile.onUseWithTile(channel);
    this.useWithEntity.onUseWithEntity(channel);
  }
}
