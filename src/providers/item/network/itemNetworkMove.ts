import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IItemMove, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ItemDragAndDrop } from "../ItemDragAndDrop/ItemDragAndDrop";

@provide(ItemNetworkMove)
export class ItemNetworkMove {
  constructor(private socketAuth: SocketAuth, private itemMove: ItemDragAndDrop) {}

  public onItemMove(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, ItemSocketEvents.Move, async (data: IItemMove, character) => {
      if (data) {
        await this.itemMove.performItemMove(data, character);
      }
    });
  }
}
