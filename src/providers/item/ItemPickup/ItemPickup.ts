import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IEquipmentAndInventoryUpdatePayload,
  IItemContainer,
  IItemContainerRead,
  IItemPickup,
  ItemSocketEvents,
  ItemType,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ItemOwnership } from "../ItemOwnership";

import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { ItemContainerHelper } from "@providers/itemContainer/ItemContainerHelper";
import { ItemPickupFromContainer } from "./ItemPickupFromContainer";
import { ItemPickupMapContainer } from "./ItemPickupMapContainer";
import { ItemPickupValidator } from "./ItemPickupValidator";
@provide(ItemPickup)
export class ItemPickup {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterWeight: CharacterWeight,

    private characterItemContainer: CharacterItemContainer,
    private equipmentSlots: EquipmentSlots,
    private itemOwnership: ItemOwnership,
    private itemPickupFromContainer: ItemPickupFromContainer,
    private itemPickupValidator: ItemPickupValidator,
    private itemPickupMapContainer: ItemPickupMapContainer,
    private itemContainerHelper: ItemContainerHelper,
    private characterInventory: CharacterInventory
  ) {}

  public async performItemPickup(itemPickupData: IItemPickup, character: ICharacter): Promise<boolean | undefined> {
    try {
      const itemToBePicked = (await this.itemPickupValidator.isItemPickupValid(itemPickupData, character)) as IItem;

      if (!itemToBePicked) {
        return false;
      }

      // this prevents item duplication (2 chars trying to pick up the same item at the same time)
      if (itemToBePicked.isBeingPickedUp) {
        this.socketMessaging.sendErrorMessageToCharacter(character);
        return false;
      }
      itemToBePicked.isBeingPickedUp = true;
      await itemToBePicked.save();

      const inventory = await this.characterInventory.getInventory(character);

      const isInventoryItem = itemToBePicked.isItemContainer && inventory === null;
      const isPickupFromMapContainer =
        itemToBePicked.x !== undefined && itemToBePicked.y !== undefined && itemToBePicked.scene !== undefined;

      itemToBePicked.key = itemToBePicked.baseKey; // support picking items from a tiled map seed
      await itemToBePicked.save();

      if (itemPickupData.fromContainerId && !isPickupFromMapContainer) {
        const pickupFromContainer = await this.itemPickupFromContainer.pickupFromContainer(
          itemPickupData,
          itemToBePicked,
          character
        );

        if (!pickupFromContainer) {
          return false;
        }
      }

      // we had to proceed with undefined check because remember that x and y can be 0, causing removeItemFromMap to not be triggered!
      if (isPickupFromMapContainer) {
        const pickupFromMap = await this.itemPickupMapContainer.pickupFromMapContainer(itemToBePicked, character);

        if (!pickupFromMap) {
          return false;
        }
      }

      const addToContainer = await this.characterItemContainer.addItemToContainer(
        itemToBePicked,
        character,
        itemPickupData.toContainerId,
        isInventoryItem
      );

      if (!addToContainer) {
        return false;
      }

      if (isInventoryItem) {
        await this.refreshEquipmentIfInventoryItem(character);

        await this.finalizePickup(itemToBePicked, character);

        return true;
      }

      if (!itemPickupData.fromContainerId && !isInventoryItem && !isPickupFromMapContainer) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Sorry, failed to remove item from container. Origin container not found."
        );
        return false;
      }

      const containerToUpdateId = itemPickupData.fromContainerId;
      const updatedContainer =
        !isPickupFromMapContainer &&
        ((await ItemContainer.findById(containerToUpdateId).lean({
          virtuals: true,
          defaults: true,
        })) as any);

      const inventoryContainerToUpdateId = itemPickupData.toContainerId;
      const updatedInventoryContainer = (await ItemContainer.findById(inventoryContainerToUpdateId).lean({
        virtuals: true,
        defaults: true,
      })) as any;

      if ((!updatedContainer && !isPickupFromMapContainer) || !updatedInventoryContainer) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, error in fetching container information.");
        return false;
      }

      const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
        inventory: updatedInventoryContainer,
        openInventoryOnUpdate: isPickupFromMapContainer,
      };

      this.updateInventoryCharacter(payloadUpdate, character);

      if (!isPickupFromMapContainer) {
        // RPG-1012 - reopen origin container using read to open with correct type
        await this.sendContainerRead(updatedContainer, character);
      }

      await this.finalizePickup(itemToBePicked, character);

      return true;
    } catch (error) {
      console.error(error);
    }
  }

  private async finalizePickup(itemToBePicked: IItem, character: ICharacter): Promise<void> {
    await this.itemOwnership.addItemOwnership(itemToBePicked, character);

    // whenever a new item is added, we need to update the character weight
    await this.characterWeight.updateCharacterWeight(character);

    await Item.updateOne({ _id: itemToBePicked._id }, { isBeingPickedUp: false }); // unlock item
  }

  private async refreshEquipmentIfInventoryItem(character: ICharacter): Promise<void> {
    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character.equipment as unknown as string);

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      equipment: equipmentSlots,
    };

    this.updateInventoryCharacter(payloadUpdate, character);
  }

  private updateInventoryCharacter(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }

  private async sendContainerRead(itemContainer: IItemContainer, character: ICharacter): Promise<void> {
    if (character && itemContainer) {
      const type = await this.itemContainerHelper.getContainerType(itemContainer);

      if (!type) {
        this.socketMessaging.sendErrorMessageToCharacter(character);
        return;
      }

      this.socketMessaging.sendEventToUser<IItemContainerRead>(character.channelId!, ItemSocketEvents.ContainerRead, {
        itemContainer,
        type,
      });
    }
  }

  public getAllowedItemTypes(): ItemType[] {
    const allowedItemTypes: ItemType[] = [];

    for (const allowedItemType of Object.keys(ItemType)) {
      allowedItemTypes.push(ItemType[allowedItemType]);
    }

    return allowedItemTypes;
  }
}
