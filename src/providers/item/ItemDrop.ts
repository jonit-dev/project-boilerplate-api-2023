import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { OperationStatus } from "@providers/types/ValidationTypes";
import {
  IEquipmentAndInventoryUpdatePayload,
  IItem,
  IItemContainer,
  IItemDrop,
  ItemSocketEvents,
  IUIShowMessage,
  UIMessageType,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterItems } from "../character/characterItems/CharacterItems";

@provide(ItemDrop)
export class ItemDrop {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterWeight: CharacterWeight,
    private characterItems: CharacterItems,
    private equipmentSlots: EquipmentSlots,
    private characterValidation: CharacterValidation
  ) {}

  public async performItemDrop(itemDropData: IItemDrop, character: ICharacter): Promise<boolean> {
    const isDropValid = await this.isItemDropValid(itemDropData, character);

    if (!isDropValid) {
      return false;
    }

    const itemToBeDropped = await Item.findById(itemDropData.itemId);

    if (itemToBeDropped) {
      let isItemRemoved = false;

      if (itemDropData.fromEquipmentSet) {
        isItemRemoved = await this.removeItemFromEquipmentSet(itemToBeDropped as unknown as IItem, character);
      } else {
        isItemRemoved = await this.removeItemFromInventory(
          itemToBeDropped as unknown as IItem,
          character,
          itemDropData.fromContainerId
        );
      }

      if (!isItemRemoved) {
        return false;
      }

      try {
        await this.characterWeight.updateCharacterWeight(character);

        const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character.equipment as unknown as string);

        let inventory = {} as IItemContainer;
        if (!itemDropData.fromEquipmentSet) {
          const updatedContainer = (await ItemContainer.findById(
            itemDropData.fromContainerId
          )) as unknown as IItemContainer;
          inventory = {
            _id: updatedContainer._id,
            parentItem: updatedContainer!.parentItem.toString(),
            owner: updatedContainer?.owner?.toString() || character.name,
            name: updatedContainer?.name,
            slotQty: updatedContainer!.slotQty,
            slots: updatedContainer?.slots,
            isEmpty: updatedContainer!.isEmpty,
          };
        }

        const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
          equipment: equipmentSlots,
          inventory: inventory,
          openEquipmentSetOnUpdate: false,
          openInventoryOnUpdate: false,
        };

        await this.tryDroppingToMap(itemDropData, itemToBeDropped as unknown as IItem);

        this.sendRefreshInventoryEvent(payloadUpdate, character);

        return true;
      } catch (err) {
        this.sendGenericErrorMessage(character);

        console.log(err);
        return false;
      }
    }
    return false;
  }

  private async tryDroppingToMap(itemDrop: IItemDrop, dropItem: IItem): Promise<void> {
    // if itemDrop toPosition has x and y, then drop item to that position in the map
    if (itemDrop.toPosition.x && itemDrop.toPosition.y) {
      await Item.updateOne(
        {
          _id: dropItem._id,
        },
        {
          x: itemDrop.x,
          y: itemDrop.y,
          scene: itemDrop.scene,
        }
      );
    }
  }

  private async removeItemFromEquipmentSet(item: IItem, character: ICharacter): Promise<boolean> {
    const equipmentSetId = character.equipment;
    const equipmentSet = await Equipment.findById(equipmentSetId);

    if (!equipmentSet) {
      this.sendCustomErrorMessage(character, "Sorry, equipment set not found.");
      return false;
    }

    const { status, message } = await this.characterItems.deleteItem(item._id, character, "equipment");

    if (status === OperationStatus.Error) {
      if (message) this.sendCustomErrorMessage(character, message);

      return false;
    }

    return true;
  }

  /**
   * This method will remove a item from the character inventory
   */
  private async removeItemFromInventory(item: IItem, character: ICharacter, fromContainerId: string): Promise<boolean> {
    const targetContainer = await ItemContainer.findById(fromContainerId);

    if (!item) {
      console.log("dropItemFromInventory: Item not found");
      this.sendGenericErrorMessage(character);
      return false;
    }

    if (!targetContainer) {
      console.log("dropItemFromInventory: Character container not found");
      this.sendGenericErrorMessage(character);
      return false;
    }

    const { status, message } = await this.characterItems.deleteItem(item._id, character, "inventory");

    if (status === OperationStatus.Error) {
      if (message) this.sendCustomErrorMessage(character, message);

      return false;
    }

    return true;
  }

  private async isItemDropValid(itemDrop: IItemDrop, character: ICharacter): Promise<Boolean> {
    const item = await Item.findById(itemDrop.itemId);
    const isFromEquipmentSet = itemDrop.fromEquipmentSet;

    if (!item) {
      this.sendCustomErrorMessage(character, "Sorry, this item is not accessible.");
      return false;
    }

    if (!isFromEquipmentSet) {
      const validation = await this.validateItemDropFromInventory(itemDrop, character);

      if (!validation) {
        return false;
      }
    }

    return this.characterValidation.hasBasicValidation(character);
  }

  private async validateItemDropFromInventory(
    itemDrop: IItemDrop,

    character: ICharacter
  ): Promise<boolean> {
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

    const hasItemInInventory = inventoryContainer?.itemIds?.find(
      (itemId) => String(itemId) === String(itemDrop.itemId)
    );

    if (!hasItemInInventory) {
      this.sendCustomErrorMessage(character, "Sorry, you do not have this item in your inventory.");
      return false;
    }

    if (itemDrop.fromContainerId.toString() !== inventoryContainer?.id.toString()) {
      this.sendCustomErrorMessage(character, "Sorry, this item does not belong to your inventory.");
      return false;
    }

    if (!inventoryContainer) {
      this.sendCustomErrorMessage(character, "Sorry, you must have a bag or backpack to drop this item.");
      return false;
    }

    return true;
  }

  private sendRefreshInventoryEvent(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
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
