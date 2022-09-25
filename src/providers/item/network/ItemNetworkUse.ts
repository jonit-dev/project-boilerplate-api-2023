import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ItemUse } from "../ItemUse";

@provide(ItemNetworkUse)
export class ItemNetworkUse {
  constructor(private socketAuth: SocketAuth, private itemUse: ItemUse) {}

  public onItemUse(channel: SocketChannel): void {
    // TODO: Khobab: Replace any by IUseItem
    this.socketAuth.authCharacterOn(channel, ItemSocketEvents.Use, async (data: any, character) => {
      if (data) {
        await this.itemUse.performItemUse(data, character);
      }
    });
  }
}
