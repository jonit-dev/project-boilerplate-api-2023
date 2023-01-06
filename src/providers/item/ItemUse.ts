import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterView } from "@providers/character/CharacterView";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { EquipmentEquip } from "@providers/equipment/EquipmentEquip";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ItemValidation } from "./validation/ItemValidation";

import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterItems } from "@providers/character/characterItems/CharacterItems";
import {
  AnimationEffectKeys,
  CharacterSocketEvents,
  ICharacterAttributeChanged,
  IEquipmentAndInventoryUpdatePayload,
  ItemSocketEvents,
  ItemSubType,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ItemUseCycle } from "./ItemUseCycle";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";

@provide(ItemUse)
export class ItemUse {
  constructor(
    private characterValidation: CharacterValidation,
    private itemValidation: ItemValidation,
    private socketMessaging: SocketMessaging,
    private equipmentEquip: EquipmentEquip,
    private characterWeight: CharacterWeight,
    private characterView: CharacterView,
    private animationEffect: AnimationEffect,
    private characterItems: CharacterItems,
    private characterInventory: CharacterItemInventory
  ) {}

  public async performItemUse(itemUse: any, character: ICharacter): Promise<boolean> {
    if (!this.characterValidation.hasBasicValidation(character)) {
      return false;
    }

    const isItemInCharacterInventory = await this.itemValidation.isItemInCharacterInventory(character, itemUse.itemId);
    if (!isItemInCharacterInventory) {
      return false;
    }

    const useItem = (await Item.findById(itemUse.itemId)) as IItem;

    if (!useItem) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you cannot use this item.");
      return false;
    }

    const bluePrintItem = itemsBlueprintIndex[useItem.key];
    if (!bluePrintItem || !bluePrintItem.usableEffect) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you cannot use this item.");
      return false;
    }

    this.applyItemUsage(bluePrintItem, character.id);

    await this.characterInventory.decrementItemFromInventoryByKey(useItem.key, character, 1);

    await this.characterWeight.updateCharacterWeight(character);

    const updatedInventoryContainer = await this.getInventoryContainer(character);

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      inventory: {
        _id: updatedInventoryContainer?._id,
        parentItem: updatedInventoryContainer!.parentItem.toString(),
        owner: updatedInventoryContainer?.owner?.toString() || character.name,
        name: updatedInventoryContainer?.name,
        slotQty: updatedInventoryContainer!.slotQty,
        slots: updatedInventoryContainer?.slots,
        allowedItemTypes: this.equipmentEquip.getAllowedItemTypes(),
        isEmpty: updatedInventoryContainer!.isEmpty,
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

  private async getInventoryContainer(character: ICharacter): Promise<IItemContainer | null> {
    const inventory = await character.inventory;
    return await ItemContainer.findById(inventory.itemContainer);
  }

  private async sendItemConsumptionEvent(character: ICharacter): Promise<void> {
    const nearbyCharacters = await this.characterView.getCharactersInView(character);

    const payload: ICharacterAttributeChanged = {
      targetId: character._id,
      health: character.health,
      mana: character.mana,
    };

    for (const nearbyCharacter of nearbyCharacters) {
      this.socketMessaging.sendEventToUser(nearbyCharacter.channelId!, CharacterSocketEvents.AttributeChanged, payload);
    }

    if (character.channelId) {
      this.socketMessaging.sendEventToUser(character.channelId, CharacterSocketEvents.AttributeChanged, payload);
    }

    await this.animationEffect.sendAnimationEventToCharacter(character, AnimationEffectKeys.LifeHeal);
  }

  private updateInventoryCharacter(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }
}
