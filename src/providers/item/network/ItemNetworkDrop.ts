import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IItemDrop, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ItemDrop } from "../ItemDrop";

@provide(ItemNetworkDrop)
export class ItemNetworkDrop {
  constructor(private socketAuth: SocketAuth, private itemDrop: ItemDrop) {}

  public onItemDrop(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, ItemSocketEvents.Drop, async (data: IItemDrop, character) => {
      if (data) {
        const dropCharacter = (await Character.findById(character._id)) as ICharacter;
        await this.itemDrop.performItemDrop(data, dropCharacter);
      }
    });
  }
}
