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
    private itemContainerHelper: ItemContainerHelper
  ) {}

  public async performItemPickup(itemPickupData: IItemPickup, character: ICharacter): Promise<boolean | undefined> {
    const session = await Item.startSession();

    session.startTransaction();

    try {
      const inventory = await character.inventory;
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
      await session.commitTransaction();

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

      // if the origin container is a MapContainer we should update the char inventory = toContainerId
      //    otherwise will update the origin container (Loot, NPC Shop, Bag on Map) = fromContainerId
      const containerToUpdateId = isPickupFromMapContainer
        ? itemPickupData.toContainerId
        : itemPickupData.fromContainerId;
      const updatedContainer = (await ItemContainer.findById(containerToUpdateId).lean({
        virtuals: true,
        defaults: true,
      })) as any;

      if (!updatedContainer) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, fetch container information.");
        return false;
      }

      if (isPickupFromMapContainer) {
        const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
          inventory: updatedContainer,
        };

        this.updateInventoryCharacter(payloadUpdate, character);
      } else {
        // RPG-1012 - reopen origin container using read to open with correct type
        await this.sendContainerRead(updatedContainer, character);
      }

      await this.finalizePickup(itemToBePicked, character);

      return true;
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
    }
  }

  private async finalizePickup(itemToBePicked: IItem, character: ICharacter): Promise<void> {
    await this.itemOwnership.addItemOwnership(itemToBePicked, character);

    // whenever a new item is added, we need to update the character weight
    await this.characterWeight.updateCharacterWeight(character);

    await Item.updateOne({ _id: itemToBePicked.id }, { isBeingPickedUp: false });
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
      this.socketMessaging.sendEventToUser<IItemContainerRead>(character.channelId!, ItemSocketEvents.ContainerRead, {
        itemContainer,
        type: (await this.itemContainerHelper.getContainerType(itemContainer))!,
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
