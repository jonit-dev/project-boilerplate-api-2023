import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { UseWithTile } from "@providers/useWith/UseWithTile";
import { provide } from "inversify-binding-decorators";
import { UseWithEntity } from "../UseWithEntity";

@provide(UseWithNetwork)
export class UseWithNetwork {
  constructor(private useWithTile: UseWithTile, private useWithEntity: UseWithEntity) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.useWithTile.onUseWithTile(channel);
    this.useWithEntity.onUseWithEntity(channel);
  }
}
