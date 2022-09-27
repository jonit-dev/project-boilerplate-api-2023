import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { provide } from "inversify-binding-decorators";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { BasicCharacterValidation } from "@providers/character/validation/BasicCharacterValidation";
import { ItemValidation } from "./validation/ItemValidation";
import {
  IEquipmentAndInventoryUpdatePayload,
  IEquipmentSet,
  ItemSocketEvents,
  ItemSubType,
  IUIShowMessage,
  UIMessageType,
  UISocketEvents,
} from "@rpg-engine/shared";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { EquipmentEquip } from "@providers/equipment/EquipmentEquip";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { CharacterView } from "@providers/character/CharacterView";
import { ItemUseCycle } from "./ItemUseCycle";
import { constant } from "lodash";

@provide(ItemUse)
export class ItemUse {
  constructor(
    private basicCharacterValidation: BasicCharacterValidation,
    private itemValidation: ItemValidation,
    private socketMessaging: SocketMessaging,
    private equipmentEquip: EquipmentEquip,
    private characterWeight: CharacterWeight,
    private characterView: CharacterView
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

    this.applyItemUsage(bluePrintItem, character.id);

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

  private applyItemUsage(bluePrintItem: Partial<IItem>, characterId: string): void {
    const intervals = bluePrintItem.subType === ItemSubType.Food ? 5 : 1;

    new ItemUseCycle(async () => {
      const character = await Character.findOne({ _id: characterId });

      if (character) {
        bluePrintItem.usableEffect(character);
        await character.save();
        await this.sendItemConsumptionEvent(character);
      }
    }, intervals);
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

  private async sendItemConsumptionEvent(character: ICharacter): Promise<void> {
    const nearbyCharacters = await this.characterView.getCharactersInView(character);
    // TODO: Khobab: added IItemConsumptionPayload interface and ItemConsumption event to shared types and use here
    const payload: any = {
      targetId: character._id,
      health: character.health,
      mana: character.mana,
    };

    for (const nearbyCharacter of nearbyCharacters) {
      this.socketMessaging.sendEventToUser(nearbyCharacter.channelId!, "ItemConsumptionEvent", payload);
    }

    if (character.channelId) {
      this.socketMessaging.sendEventToUser(character.channelId, "ItemConsumptionEvent", payload);
    }
  }

  private sendCustomErrorMessage(character: ICharacter, message: string, type: UIMessageType = "error"): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message,
      type,
    });
  }

  private updateInventoryCharacter(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }
}
