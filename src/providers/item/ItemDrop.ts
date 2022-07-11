import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IItemDrop, IUIShowMessage, UIMessageType, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ItemDrop)
export class ItemDrop {
  constructor(private socketMessaging: SocketMessaging, private characterWeight: CharacterWeight) {}

  public async performItemDrop(itemDrop: IItemDrop, character: ICharacter): Promise<Boolean> {
    const isDropValid = await this.isItemDropValid(itemDrop, character);

    if (!isDropValid) {
      return false;
    }

    const dropItem = (await Item.findById(itemDrop.itemId)) as unknown as IItem;

    if (dropItem) {
      const isItemRemoved = await this.removeItemFromInventory(dropItem, character, itemDrop.fromContainerId);
      if (!isItemRemoved) return false;

      await this.characterWeight.updateCharacterWeight(character);

      return true;
    }

    return false;
  }

  /**
   * This method will remove a item from the character inventory
   */
  private async removeItemFromInventory(item: IItem, character: ICharacter, fromContainerId: string): Promise<Boolean> {
    const selectedItem = (await Item.findById(item.id)) as IItem;
    const targetContainer = (await ItemContainer.findById(fromContainerId)) as unknown as IItemContainer;

    if (!selectedItem) {
      console.log("dropItemFromInventory: Item not found");
      this.sendGenericErrorMessage(character);
      return false;
    }

    if (!targetContainer) {
      console.log("dropItemFromInventory: Character container not found");
      this.sendGenericErrorMessage(character);
      return false;
    }

    for (let i = 0; i < targetContainer.slotQty; i++) {
      const slotItem = targetContainer.slots?.[i];

      if (!slotItem) continue;
      if (slotItem.key === selectedItem.key) {
        // Changing item slot to null, thus removing it
        targetContainer.slots[i] = null;

        await ItemContainer.updateOne(
          {
            _id: targetContainer.id,
          },
          {
            $set: {
              slots: {
                ...targetContainer.slots,
              },
            },
          }
        );

        return true;
      }
    }

    return false;
  }

  private async isItemDropValid(itemDrop: IItemDrop, character: ICharacter): Promise<Boolean> {
    const item = await Item.findById(itemDrop.itemId);
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

    if (!item) {
      this.sendCustomErrorMessage(character, "Sorry, this item is not accessible.");
      return false;
    }

    const hasItemInInventory = inventoryContainer?.itemIds?.find((itemId) => String(itemId) === String(item.id));

    if (!hasItemInInventory) {
      this.sendCustomErrorMessage(character, "Sorry, you do not have this item in your inventory.");
      return false;
    }

    if (itemDrop.fromContainerId.toString() !== inventoryContainer?.id.toString()) {
      this.sendCustomErrorMessage(character, "Sorry, this item does not belong to your inventory.");
      return false;
    }

    if (character.isBanned) {
      this.sendCustomErrorMessage(character, "Sorry, you are banned and can't drop this item.");
      return false;
    }

    if (!character.isOnline) {
      this.sendCustomErrorMessage(character, "Sorry, you must be online to drop this item.");
      return false;
    }

    if (!inventoryContainer) {
      this.sendCustomErrorMessage(character, "Sorry, you must have a bag or backpack to drop this item.");
      return false;
    }

    return true;
  }

  public sendGenericErrorMessage(character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: "Sorry, failed to drop your item from your inventory.",
      type: "error",
    });
  }

  public sendCustomErrorMessage(character: ICharacter, message: string, type: UIMessageType = "error"): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message,
      type,
    });
  }
}
