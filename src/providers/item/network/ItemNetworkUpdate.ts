import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";

@provide(ItemNetworkUpdate)
export class ItemNetworkUpdate {
  public onItemUpdate(channel: SocketChannel): void {
    //! TODO: This would be responsible for changing item position in the game when the client wants to drag and drop, for example.
  }
}
