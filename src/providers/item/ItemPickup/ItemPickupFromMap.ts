import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";
import { ItemView } from "../ItemView";

@provide(ItemPickupFromMap)
export class ItemPickupFromMap {
  constructor(private itemView: ItemView, private socketMessaging: SocketMessaging) {}

  public async pickupFromMapContainer(itemToBePicked: IItem, character: ICharacter): Promise<boolean> {
    // If an item has a x, y and scene, it means its coming from a map pickup. So we should destroy its representation and warn other characters nearby.
    const itemRemovedFromMap = await this.itemView.removeItemFromMap(itemToBePicked);

    if (!itemRemovedFromMap) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, failed to remove item from map.");
      return false;
    }

    return true;
  }
}
