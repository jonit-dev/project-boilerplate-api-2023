import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { MovementHelper } from "@providers/movement/MovementHelper";
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
    private characterItems: CharacterItems,
    private equipmentSlots: EquipmentSlots,
    private characterValidation: CharacterValidation,
    private movementHelper: MovementHelper,
    private characterWeight: CharacterWeight
  ) {}

  //! For now, only a drop from inventory or equipment set is allowed.
  public async performItemDrop(itemDropData: IItemDrop, character: ICharacter): Promise<boolean> {
    const isDropValid = await this.isItemDropValid(itemDropData, character);
    const source = itemDropData.source;
    if (!isDropValid) {
      return false;
    }

    const itemToBeDropped = await Item.findById(itemDropData.itemId);

    if (!itemToBeDropped) {
      this.sendCustomErrorMessage(character, "Sorry, item to be dropped wasn't found.");
      return false;
    }

    const mapDrop = await this.tryDroppingToMap(itemDropData, itemToBeDropped as unknown as IItem, character);

    if (!mapDrop) {
      return false;
    }

    let isItemRemoved = false;

    try {
      switch (source) {
        case "equipment":
          isItemRemoved = await this.removeItemFromEquipmentSet(itemToBeDropped as unknown as IItem, character);

          if (!isItemRemoved) {
            this.sendGenericErrorMessage(character);
            return false;
          }

          const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character.equipment as unknown as string);

          this.sendRefreshItemsEvent(
            {
              equipment: equipmentSlots,
              openEquipmentSetOnUpdate: false,
            },
            character
          );

          break;
        case "inventory":
          isItemRemoved = await this.removeItemFromInventory(
            itemToBeDropped as unknown as IItem,
            character,
            itemDropData.fromContainerId
          );

          if (!isItemRemoved) {
            this.sendGenericErrorMessage(character);
            return false;
          }

          const inventoryContainer = (await ItemContainer.findById(
            itemDropData.fromContainerId
          )) as unknown as IItemContainer;

          const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
            inventory: inventoryContainer,
            openEquipmentSetOnUpdate: false,
            openInventoryOnUpdate: false,
          };

          this.sendRefreshItemsEvent(payloadUpdate, character);

          break;
      }

      await this.characterWeight.updateCharacterWeight(character);

      return true;
    } catch (err) {
      this.sendGenericErrorMessage(character);

      console.log(err);
      return false;
    }
  }

  private async tryDroppingToMap(itemDrop: IItemDrop, dropItem: IItem, character: ICharacter): Promise<boolean> {
    // if itemDrop toPosition has x and y, then drop item to that position in the map, if not, then drop to the character position

    const targetX = itemDrop.toPosition?.x || itemDrop.x;
    const targetY = itemDrop.toPosition?.y || itemDrop.y;

    // check if targetX and Y is under range

    const isUnderRange = this.movementHelper.isUnderRange(character.x, character.y, targetX, targetY, 8);

    if (!isUnderRange) {
      this.sendCustomErrorMessage(character, "Sorry, you're trying to drop this item too far away.");
      return false;
    }

    await Item.updateOne(
      {
        _id: dropItem._id,
      },
      {
        x: targetX,
        y: targetY,
        scene: itemDrop.scene,
      }
    );

    return true;
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
    const isFromEquipmentSet = itemDrop.source === "equipment";

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

  private sendRefreshItemsEvent(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
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
