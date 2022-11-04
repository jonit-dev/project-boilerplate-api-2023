import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { MathHelper } from "@providers/math/MathHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IEquipmentAndInventoryUpdatePayload,
  IItemContainer,
  ItemSocketEvents,
  ITradeRequestItem,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterItemContainer } from "./characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "./characterItems/CharacterItemInventory";
import { CharacterTradingValidation } from "./CharacterTradingValidation";
import { CharacterWeight } from "./CharacterWeight";

@provide(CharacterTradingNPCSell)
export class CharacterTradingNPCSell {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItemContainer: CharacterItemContainer,
    private characterItemInventory: CharacterItemInventory,
    private characterWeight: CharacterWeight,
    private characterTradingValidation: CharacterTradingValidation,
    private mathHelper: MathHelper
  ) {}

  public async sellItemsToNPC(character: ICharacter, npc: INPC, items: ITradeRequestItem[]): Promise<void> {
    if (!items.length) {
      return;
    }

    items = this.mergeSameItems(items);

    const isValid = await this.characterTradingValidation.validateSellTransaction(character, npc, items);
    if (!isValid) {
      return;
    }

    const soldItems = await this.removeItemsFromInventory(items, character);
    if (!soldItems.length) {
      return;
    }

    await this.addGoldToInventory(soldItems, character);

    await this.characterWeight.updateCharacterWeight(character);

    await this.sendRefreshItemsEvent(character);
  }

  private mergeSameItems(items: ITradeRequestItem[]): ITradeRequestItem[] {
    const obj = {};

    for (const item of items) {
      obj[item.key] = (obj[item.key] ?? 0) + item.qty;
    }

    const merged: ITradeRequestItem[] = [];
    for (const key in obj) {
      merged.push({
        key: key,
        qty: obj[key],
      });
    }

    return merged;
  }

  private async removeItemsFromInventory(
    items: ITradeRequestItem[],
    character: ICharacter
  ): Promise<ITradeRequestItem[]> {
    const removedItems: ITradeRequestItem[] = [];
    for (const item of items) {
      const success = await this.characterItemInventory.decrementItemFromInventory(item.key, character, item.qty);
      if (success) {
        removedItems.push(item);
      }
    }
    // if an item is failed to decrement then error would be sent from inside the decrement function
    return removedItems;
  }

  private async addGoldToInventory(items: ITradeRequestItem[], character: ICharacter): Promise<void> {
    const blueprint = itemsBlueprintIndex[OthersBlueprint.GoldCoin];
    const inventory = await character.inventory;
    const inventoryContainerId = inventory.itemContainer as unknown as string;

    let qty = this.getGoldQuantity(items);
    let success = true;

    while (qty > 0) {
      const newItem = new Item({ ...blueprint });

      if (newItem.maxStackSize >= qty) {
        newItem.stackQty = qty;
        qty = 0;
      } else {
        newItem.stackQty = newItem.maxStackSize;
        qty = this.mathHelper.fixPrecision(qty - newItem.maxStackSize);
      }

      await newItem.save();

      const wasAdded = await this.characterItemContainer.addItemToContainer(newItem, character, inventoryContainerId);

      success = success && wasAdded;
    }

    if (!success) {
      this.sendErrorOccurred(character);
    }
  }

  private getGoldQuantity(items: ITradeRequestItem[]): number {
    let qty = 0;

    for (const item of items) {
      const blueprint = itemsBlueprintIndex[item.key];
      qty += item.qty * blueprint.sellPrice;
    }

    qty = this.mathHelper.fixPrecision(qty);

    return qty;
  }

  private async sendRefreshItemsEvent(character: ICharacter): Promise<void> {
    const inventory = await character.inventory;
    const inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      inventory: inventoryContainer,
      openEquipmentSetOnUpdate: false,
      openInventoryOnUpdate: true,
    };

    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }

  private sendErrorOccurred(character: ICharacter): void {
    this.socketMessaging.sendErrorMessageToCharacter(character, "An error occurred while processing your trade.");
  }
}
