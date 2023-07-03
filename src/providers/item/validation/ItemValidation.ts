import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IItemContainer } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ItemValidation)
export class ItemValidation {
  constructor(private socketMessaging: SocketMessaging, private characterInventory: CharacterInventory) {}

  public async isItemInCharacterInventory(character: ICharacter, itemId: string): Promise<boolean> {
    const inventory = await this.characterInventory.getInventory(character);

    if (!inventory) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you must have a bag or backpack to drop this item."
      );
      return false;
    }

    const inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)
      .lean()
      .cacheQuery({
        cacheKey: `${inventory.itemContainer}-inventoryContainer`,
      })) as unknown as IItemContainer;

    if (!inventoryContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, inventory container not found.");
      return false;
    }

    const hasItemInInventory = Object.values(inventoryContainer.slots).find(
      (citemId) => String(citemId?._id) === String(itemId)
    );

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
