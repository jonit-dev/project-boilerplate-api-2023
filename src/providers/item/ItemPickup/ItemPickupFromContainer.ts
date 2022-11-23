import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IItemPickup } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ItemPickupFromContainer)
export class ItemPickupFromContainer {
  constructor(private socketMessaging: SocketMessaging, private characterItemSlots: CharacterItemSlots) {}

  public async pickupFromContainer(
    itemPickupData: IItemPickup,
    itemToBePicked: IItem,
    character: ICharacter
  ): Promise<boolean> {
    const fromContainer = (await ItemContainer.findById(itemPickupData.fromContainerId)) as unknown as IItemContainer;

    if (!fromContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, the origin container was not found.");
      return false;
    }

    const removeFromOriginContainer = await this.removeFromOriginContainer(character, fromContainer, itemToBePicked);

    if (!removeFromOriginContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, failed to remove the item from the origin container."
      );
      return false;
    }

    return true;
  }

  private async removeFromOriginContainer(
    character: ICharacter,
    fromContainer: IItemContainer,
    itemToBeRemoved: IItem
  ): Promise<boolean> {
    const wasRemoved = await this.characterItemSlots.deleteItemOnSlot(fromContainer, itemToBeRemoved._id);

    if (!wasRemoved) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, failed to remove the item from the origin container."
      );
      return false;
    }

    return true;
  }
}
