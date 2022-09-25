import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IUIShowMessage, UIMessageType, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ItemValidation)
export class ItemValidation {
  constructor(private socketMessaging: SocketMessaging) {}

  public async isItemInCharacterInventory(character: ICharacter, itemId: string): Promise<boolean> {
    const inventory = await character.inventory;

    if (!inventory) {
      this.sendCustomErrorMessage(character, "Sorry, you must have a bag or backpack to drop this item.");
      return false;
    }

    const inventoryContainer = await ItemContainer.findById(inventory.itemContainer);

    if (!inventoryContainer) {
      this.sendCustomErrorMessage(character, "Sorry, inventory container not found.");
      return false;
    }

    const hasItemInInventory = inventoryContainer?.itemIds?.find((citemId) => String(citemId) === String(itemId));

    if (!hasItemInInventory) {
      this.sendCustomErrorMessage(character, "Sorry, you do not have this item in your inventory.");
      return false;
    }

    return true;
  }

  public sendCustomErrorMessage(character: ICharacter, message: string, type: UIMessageType = "error"): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message,
      type,
    });
  }
}
