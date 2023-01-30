import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
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
        const pickupCharacter = (await Character.findById(character._id)) as ICharacter;
        await this.itemPickup.performItemPickup(data, pickupCharacter);
      }
    });
  }
}
