import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { provide } from "inversify-binding-decorators";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { BasicCharacterValidation } from "@providers/character/validation/BasicCharacterValidation";
import { ItemValidation } from "./validation/ItemValidation";
import {
  IEquipmentAndInventoryUpdatePayload,
  IEquipmentSet,
  ItemSocketEvents,
  IUIShowMessage,
  UIMessageType,
  UISocketEvents,
} from "@rpg-engine/shared";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { EquipmentEquip } from "@providers/equipment/EquipmentEquip";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { IEquipment } from "@entities/ModuleCharacter/EquipmentModel";

@provide(ItemUse)
export class ItemUse {
  constructor(
    private basicCharacterValidation: BasicCharacterValidation,
    private itemValidation: ItemValidation,
    private socketMessaging: SocketMessaging,
    private equipmentEquip: EquipmentEquip,
    private characterWeight: CharacterWeight
  ) {}

  public async performItemUse(itemUse: any, character: ICharacter): Promise<boolean> {
    if (!this.basicCharacterValidation.isCharacterValid(character)) {
      return false;
    }

    const isItemInCharacterInventory = await this.itemValidation.isItemInCharacterInventory(character, itemUse.itemId);
    if (!isItemInCharacterInventory) {
      return false;
    }

    const useItem = (await Item.findById(itemUse.itemId)) as IItem;

    if (!useItem) {
      this.sendCustomErrorMessage(character, "Sorry, this item is not accessible.");
      return false;
    }

    const bluePrintItem = itemsBlueprintIndex[useItem.key];
    if (!bluePrintItem || !bluePrintItem.usableEffect) {
      this.sendCustomErrorMessage(character, "Sorry, this item is not accessible.");
      return false;
    }

    await bluePrintItem.usableEffect(character);

    const inventoryContainer = await this.getInventoryContainer(character);

    if (!inventoryContainer) {
      return false;
    }

    await this.consumeItem(inventoryContainer, useItem);

    await this.characterWeight.updateCharacterWeight(character);

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      equipment: {} as IEquipmentSet,
      inventory: {
        _id: inventoryContainer._id,
        parentItem: inventoryContainer!.parentItem.toString(),
        owner: inventoryContainer?.owner?.toString() || character.name,
        name: inventoryContainer?.name,
        slotQty: inventoryContainer!.slotQty,
        slots: inventoryContainer?.slots,
        allowedItemTypes: this.equipmentEquip.getAllowedItemTypes(),
        isEmpty: inventoryContainer!.isEmpty,
      },
    };

    this.updateInventoryCharacter(payloadUpdate, character);

    return true;
  }

  private sendCustomErrorMessage(character: ICharacter, message: string, type: UIMessageType = "error"): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message,
      type,
    });
  }

  private async consumeItem(inventoryContainer: IItemContainer, item: IItem): Promise<void> {
    let stackReduced = false;

    if (item.isStackable && item.stackQty && item.stackQty > 1) {
      item.stackQty -= 1;
      await item.save();

      for (let i = 0; i < inventoryContainer.slotQty; i++) {
        const slotItem = inventoryContainer.slots?.[i];
        if (slotItem && slotItem.key === item.key) {
          inventoryContainer.slots[i].stackQty = item.stackQty;
        }
      }

      inventoryContainer.markModified("slots");
      await inventoryContainer.save();

      stackReduced = true;
    }

    if (!stackReduced) {
      await this.equipmentEquip.removeItemFromInventory(item._id, inventoryContainer);
      await Item.deleteOne({ _id: item._id });
    }
  }

  private async getInventoryContainer(character: ICharacter): Promise<IItemContainer | null> {
    const inventory = await character.inventory;
    if (!inventory) {
      return null;
    }

    const inventoryContainer = await ItemContainer.findById(inventory.itemContainer);
    if (!inventoryContainer) {
      return null;
    }

    return inventoryContainer;
  }

  private updateInventoryCharacter(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }
}
