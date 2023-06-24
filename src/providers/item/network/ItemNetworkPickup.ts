import { Locker } from "@providers/locks/Locker";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IItemPickup, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ItemPickup } from "../ItemPickup/ItemPickup";

@provide(ItemNetworkPickup)
export class ItemNetworkPickup {
  constructor(private socketAuth: SocketAuth, private itemPickup: ItemPickup, private locker: Locker) {}

  public onItemPickup(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, ItemSocketEvents.Pickup, async (data: IItemPickup, character) => {
      if (data) {
        await this.itemPickup.performItemPickup(data, character);
      }
    });
  }
}
