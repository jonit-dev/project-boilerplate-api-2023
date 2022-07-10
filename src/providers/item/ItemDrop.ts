import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterView } from "@providers/character/CharacterView";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IItemDrop, IUIShowMessage, UIMessageType, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ItemView } from "./ItemView";

@provide(ItemDrop)
export class ItemDrop {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterWeight: CharacterWeight,
    private itemView: ItemView,
    private characterView: CharacterView
  ) {}

  public async performItemDrop(itemDrop: IItemDrop, character: ICharacter): Promise<Boolean> {
    const isDropValid = await this.isItemDropValid(itemDrop, character);

    if (!isDropValid) {
      return false;
    }

    const dropItem = (await Item.findById(itemDrop.itemId)) as unknown as IItem;

    if (dropItem) {
      const isItemRemoved = await this.removeItemFromInventory(dropItem, character, itemDrop.fromContainerId);
      if (!isItemRemoved) return false;

      await this.updateItemInViewAndCharWeight(character, itemDrop);
      return true;
    }

    return false;
  }

  private async updateItemInViewAndCharWeight(character: ICharacter, itemDrop: IItemDrop): Promise<Boolean> {
    // whenever a item is dropped, we need to update the character weight
    await this.characterWeight.updateCharacterWeight(character);

    // After removing item from character and updating it's weigth, let's create the item on the map
    await this.characterView.addToCharacterView(
      character,
      {
        id: itemDrop.itemId,
        x: itemDrop.x,
        y: itemDrop.y,
        scene: itemDrop.scene,
      },
      "items"
    );

    // Should we warn the nearby characters about new items in view?
    await this.itemView.warnCharacterAboutItemsInView(character);

    return true;
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

    const container = await ItemContainer.findById(inventory.itemContainer);

    if (!item) {
      this.sendCustomErrorMessage(character, "Sorry, this item is not accessible.");
      return false;
    }

    if (itemDrop.fromContainerId.toString() !== container?.id.toString()) {
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

    if (!container) {
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
