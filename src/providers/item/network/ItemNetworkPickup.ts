import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IItemPickup, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ItemPickup } from "../ItemPickup";

@provide(ItemNetworkPickup)
export class ItemNetworkPickup {
  constructor(private socketAuth: SocketAuth, private itemPickup: ItemPickup) {}

  public onItemPickup(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, ItemSocketEvents.Pickup, async (data: IItemPickup, character) => {
      if (data) {
        const itemPickup = await this.itemPickup.performItemPickup(data, character);
        if (!itemPickup) {
          this.itemPickup.sendCustomErrorMessage(
            character,
            "Sorry, something went wrong while trying to pickup this item."
          );
        }
      }
    });
  }
}
