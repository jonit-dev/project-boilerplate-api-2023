import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";

@provide(ItemValidation)
export class ItemValidation {
  constructor(private socketMessaging: SocketMessaging) {}

  public async isItemInCharacterInventory(character: ICharacter, itemId: string): Promise<boolean> {
    const inventory = await character.inventory;

    if (!inventory) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you must have a bag or backpack to drop this item."
      );
      return false;
    }

    const inventoryContainer = await ItemContainer.findById(inventory.itemContainer);

    if (!inventoryContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, inventory container not found.");
      return false;
    }

    const hasItemInInventory = inventoryContainer?.itemIds?.find((citemId) => String(citemId) === String(itemId));

    if (!hasItemInInventory) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you do not have this item in your inventory."
      );
      return false;
    }

    return true;
  }
}
