import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterItems } from "@providers/character/characterItems/CharacterItems";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentAndInventoryUpdatePayload, IItemPickup, ItemSocketEvents, ItemType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ItemOwnership } from "./ItemOwnership";
import { ItemView } from "./ItemView";
@provide(ItemPickup)
export class ItemPickup {
  constructor(
    private socketMessaging: SocketMessaging,
    private movementHelper: MovementHelper,
    private characterWeight: CharacterWeight,
    private itemView: ItemView,
    private characterValidation: CharacterValidation,
    private characterItems: CharacterItems,
    private characterItemSlots: CharacterItemSlots,
    private characterItemContainer: CharacterItemContainer,
    private equipmentSlots: EquipmentSlots,
    private itemOwnership: ItemOwnership
  ) {}

  public async performItemPickup(itemPickupData: IItemPickup, character: ICharacter): Promise<boolean> {
    const itemToBePicked = (await Item.findById(itemPickupData.itemId)) as unknown as IItem;

    if (!itemToBePicked) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, the item to be picked up was not found.");
      return false;
    }

    const inventory = await character.inventory;
    const isInventoryItem = itemToBePicked.isItemContainer && inventory === null;
    const isPickupValid = await this.isItemPickupValid(itemToBePicked, itemPickupData, character, isInventoryItem);

    const isMapContainer =
      itemToBePicked.x !== undefined && itemToBePicked.y !== undefined && itemToBePicked.scene !== undefined;

    if (!isPickupValid) {
      return false;
    }

    itemToBePicked.key = itemToBePicked.baseKey; // support picking items from a tiled map seed
    await itemToBePicked.save();

    const addToContainer = await this.characterItemContainer.addItemToContainer(
      itemToBePicked,
      character,
      itemPickupData.toContainerId,
      isInventoryItem
    );

    if (!addToContainer) {
      return false;
    }

    // whenever a new item is added, we need to update the character weight
    await this.characterWeight.updateCharacterWeight(character);

    // we had to proceed with undefined check because remember that x and y can be 0, causing removeItemFromMap to not be triggered!
    if (isMapContainer) {
      // If an item has a x, y and scene, it means its coming from a map pickup. So we should destroy its representation and warn other characters nearby.
      const itemRemovedFromMap = await this.itemView.removeItemFromMap(itemToBePicked);

      if (!itemRemovedFromMap) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, failed to remove item from map.");
        return false;
      }
    } else {
      if (!itemPickupData.fromContainerId && !isInventoryItem) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Sorry, failed to remove item from container. Origin container not found."
        );
        return false;
      }

      if (!isInventoryItem) {
        // This regulates the pickup of items in containers like loot containers. Note that we canno't 'pickup' items from equipment, just unequip them to the inventory.
        const isItemRemoved = await this.removeItemFromContainer(
          itemToBePicked as unknown as IItem,
          character,
          itemPickupData.fromContainerId
        );
        if (!isItemRemoved) {
          this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, failed to remove item from container.");
          return false;
        }
      }
    }

    if (!isInventoryItem) {
      // if the origin container is a MapContainer so should update the char inventory
      //    otherwise will update the origin container (Loot, NPC Shop, Bag on Map)
      const containerToUpdateId = isMapContainer ? itemPickupData.toContainerId : itemPickupData.fromContainerId;
      const updatedContainer = (await ItemContainer.findById(containerToUpdateId)) as any;

      if (!updatedContainer) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, fetch container information.");
        return false;
      }

      const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
        inventory: updatedContainer,
      };

      this.updateInventoryCharacter(payloadUpdate, character);
    } else {
      const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character.equipment as unknown as string);

      const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
        equipment: equipmentSlots,
      };

      this.updateInventoryCharacter(payloadUpdate, character);
    }

    await this.itemOwnership.addItemOwnership(itemToBePicked, character);

    return true;
  }

  private updateInventoryCharacter(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }

  private async removeItemFromContainer(
    item: IItem,
    character: ICharacter,
    fromContainerId: string | undefined
  ): Promise<Boolean> {
    const selectedItem = (await Item.findById(item.id)) as IItem;
    if (!selectedItem) {
      this.socketMessaging.sendErrorMessageToCharacter(character);
      return false;
    }

    const targetContainer = (await ItemContainer.findById(fromContainerId)) as unknown as IItemContainer;
    if (!targetContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character);
      return false;
    }

    if (targetContainer) {
      return await this.characterItemSlots.deleteItemOnSlot(targetContainer, item._id);
    }
    return false;
  }

  private async isItemPickupValid(
    item: IItem,
    itemPickupData: IItemPickup,
    character: ICharacter,
    isInventoryItem: boolean
  ): Promise<Boolean> {
    if (isInventoryItem) {
      // validate if equipment container exists
      const equipmentContainer = await Equipment.findById(character.equipment);

      if (!equipmentContainer) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, equipment container not found");
        return false;
      }
    }

    const inventory = await character.inventory;

    if (!inventory && !item.isItemContainer && !isInventoryItem) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you need an inventory to pick this item.");
      return false;
    }

    if (!item.isItemContainer) {
      const hasAvailableSlot = await this.characterItemSlots.hasAvailableSlot(itemPickupData.toContainerId, item);
      if (!hasAvailableSlot) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, your container is full.");
        return false;
      }
    }

    const isItemOnMap = item.x !== undefined && item.y !== undefined && item.scene !== undefined;

    if (isItemOnMap) {
      if (character.scene !== item.scene) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you can't pick up items from another map.");
        return false;
      }
    }

    const weight = await this.characterWeight.getWeight(character);
    const maxWeight = await this.characterWeight.getMaxWeight(character);

    const ratio = (weight + item.weight) / maxWeight;

    if (ratio > 4) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you are already carrying too much weight!");
      return false;
    }

    if (!item.isStorable) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you cannot store this item.");
      return false;
    }

    if (item.x !== undefined && item.y !== undefined && item.scene !== undefined) {
      const underRange = this.movementHelper.isUnderRange(
        character.x,
        character.y,
        itemPickupData.x,
        itemPickupData.y,
        2
      );
      if (!underRange) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Sorry, you are too far away to pick up this item."
        );
        return false;
      }
    }

    if (!isItemOnMap) {
      // if item is not on the map

      if (item.owner && item.owner !== character._id.toString()) {
        // check if item is owned by someone else
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, this item is not yours.");
        return false;
      }
    }

    // if item is not a container, we can proceed

    const characterAlreadyHasItem = await this.characterItems.hasItem(
      item._id,
      character,
      isInventoryItem ? "equipment" : "inventory"
    );
    if (characterAlreadyHasItem) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you already have this item.");
      return false;
    }

    return this.characterValidation.hasBasicValidation(character);
  }

  public getAllowedItemTypes(): ItemType[] {
    const allowedItemTypes: ItemType[] = [];

    for (const allowedItemType of Object.keys(ItemType)) {
      allowedItemTypes.push(ItemType[allowedItemType]);
    }

    return allowedItemTypes;
  }
}
