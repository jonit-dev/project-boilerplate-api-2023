import { Item } from "@entities/ModuleInventory/ItemModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IItemPickup, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ItemPickup } from "../ItemPickup/ItemPickup";

@provide(ItemNetworkPickup)
export class ItemNetworkPickup {
  constructor(private socketAuth: SocketAuth, private itemPickup: ItemPickup) {}

  public onItemPickup(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, ItemSocketEvents.Pickup, async (data: IItemPickup, character) => {
      if (data) {
        const result = await this.itemPickup.performItemPickup(data, character);

        // if we couldnt pick this up, make sure it remains unlocked
        if (!result) {
          await Item.updateOne({ _id: data.itemId }, { isBeingPickedUp: false }); // unlock item
        }
      }
    });
  }
}
