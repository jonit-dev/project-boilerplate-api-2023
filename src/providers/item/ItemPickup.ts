import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterView } from "@providers/character/CharacterView";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IItemPickup,
  IUIShowMessage,
  IViewDestroyElementPayload,
  UIMessageType,
  UISocketEvents,
  ViewSocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ItemPickup)
export class ItemPickup {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView,
    private movementHelper: MovementHelper,
    private characterWeight: CharacterWeight
  ) {}

  public async performItemPickup(itemPickup: IItemPickup, character: ICharacter): Promise<Boolean> {
    const isPickupValid = await this.isItemPickupValid(itemPickup, character);

    if (!isPickupValid) {
      return false;
    }

    const pickupItem = (await Item.findById(itemPickup.itemId)) as unknown as IItem;

    if (pickupItem) {
      const isItemAdded = await this.addItemToInventory(pickupItem, character, itemPickup.toContainerId);
      if (!isItemAdded) return false;

      // Perform item deletion on map after item added
      this.socketMessaging.sendEventToUser<IViewDestroyElementPayload>(character.channelId!, ViewSocketEvents.Destroy, {
        id: pickupItem.id,
        type: "items",
      });

      await this.characterView.removeFromCharacterView(character, pickupItem.id, "items");

      return true;
    }

    return false;
  }

  /**
   * This method will add or stack a item to the character inventory
   */
  private async addItemToInventory(item: IItem, character: ICharacter, toContainerId: string): Promise<Boolean> {
    const selectedItem = (await Item.findById(item.id)) as IItem;
    const targetContainer = (await ItemContainer.findById(toContainerId)) as unknown as IItemContainer;

    if (!selectedItem) {
      console.log("addItemToInventory: Item not found");
      this.sendGenericErrorMessage(character);
      return false;
    }

    if (!targetContainer) {
      console.log("addItemToInventory: Character container not found");
      this.sendGenericErrorMessage(character);
      return false;
    }

    if (targetContainer) {
      let isNewItem = true;

      // Item Type is valid to add to a container?
      const isItemTypeValid = targetContainer.allowedItemTypes?.filter((entry) => {
        return entry === selectedItem?.type;
      });
      if (!isItemTypeValid) {
        this.sendCustomErrorMessage(character, "Sorry, your inventory does not support this item type.");
        return false;
      }

      // Inventory is empty, slot checking not needed
      if (targetContainer.isEmpty) isNewItem = true;

      if (selectedItem.isStackable) {
        const itemStacked = await this.tryAddingItemToStack(character, targetContainer, selectedItem);

        if (itemStacked) {
          return true;
        }
      }

      // Check's done, need to create new item on char inventory
      if (isNewItem) {
        const firstAvailableSlotIndex = targetContainer.firstAvailableSlotId;

        if (firstAvailableSlotIndex === null) {
          this.sendCustomErrorMessage(character, "Sorry, your inventory is full.");
          return false;
        }

        if (firstAvailableSlotIndex >= 0) {
          targetContainer.slots[firstAvailableSlotIndex] = selectedItem;

          await ItemContainer.updateOne(
            {
              _id: targetContainer.id,
            },
            {
              $set: {
                slots: targetContainer.slots,
              },
            }
          );

          return true;
        }
      }
    }

    return false;
  }

  private async tryAddingItemToStack(
    character: ICharacter,
    targetContainer: IItemContainer,
    selectedItem: IItem
  ): Promise<boolean> {
    // loop through all inventory container slots, checking to see if selectedItem can be stackable

    if (!targetContainer.slots) {
      console.log("tryAddingItemToStack: no slots in container ", targetContainer.id);
      this.sendCustomErrorMessage(character, "Sorry, there are no slots in your container.");
      return false;
    }

    for (let i = 0; i < targetContainer.slotQty; i++) {
      const slotItem = targetContainer.slots?.[i];

      if (!slotItem) continue;

      if (slotItem.key === selectedItem.key) {
        if (slotItem.stackQty) {
          targetContainer.slots[i] = {
            ...slotItem,
            stackQty: slotItem.stackQty + selectedItem.stackQty,
          };

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
    }

    return false;
  }

  private async isItemPickupValid(itemPickup: IItemPickup, character: ICharacter): Promise<Boolean> {
    const item = await Item.findById(itemPickup.itemId);

    const inventory = await character.inventory;

    if (!item) {
      this.sendCustomErrorMessage(character, "Sorry, this item is not accessible.");

      return false;
    }

    if (!item.isStorable) {
      this.sendCustomErrorMessage(character, "Sorry, you cannot store this item.");
      return false;
    }

    const underRange = this.movementHelper.isUnderRange(character.x, character.y, itemPickup.x, itemPickup.y, 1);
    if (!underRange) {
      this.sendCustomErrorMessage(character, "Sorry, you are too far away to pick up this item.");
      return false;
    }

    if (item.owner && item.owner !== character.owner) {
      this.sendCustomErrorMessage(character, "Sorry, this item is not yours.");
      return false;
    }

    if (character.isBanned) {
      this.sendCustomErrorMessage(character, "Sorry, you are banned and can't pick up this item.");
      return false;
    }

    if (!character.isOnline) {
      this.sendCustomErrorMessage(character, "Sorry, you must be online to pick up this item.");
      return false;
    }

    if (!inventory) {
      this.sendCustomErrorMessage(character, "Sorry, you must have a bag or backpack to pick up this item.");
      return false;
    }

    // TODO: Character weight is valid for this item?

    return true;
  }

  public sendGenericErrorMessage(character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: "Sorry, failed to add your item your inventory.",
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
