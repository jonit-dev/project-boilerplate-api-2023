import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentAndInventoryUpdatePayload, IItemPickup } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

import { IItem } from "@entities/ModuleInventory/ItemModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { MapHelper } from "@providers/map/MapHelper";
import { ItemPickupFromContainer } from "./ItemPickupFromContainer";
import { ItemPickupFromMap } from "./ItemPickupFromMap";
import { ItemPickupUpdater } from "./ItemPickupUpdater";
import { ItemPickupValidator } from "./ItemPickupValidator";
@provide(ItemPickup)
export class ItemPickup {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItemContainer: CharacterItemContainer,
    private itemPickupFromContainer: ItemPickupFromContainer,
    private itemPickupValidator: ItemPickupValidator,
    private itemPickupMapContainer: ItemPickupFromMap,
    private characterInventory: CharacterInventory,
    private itemPickupUpdater: ItemPickupUpdater,
    private mapHelper: MapHelper
  ) {}

  public async performItemPickup(itemPickupData: IItemPickup, character: ICharacter): Promise<boolean | undefined> {
    const itemToBePicked = (await this.itemPickupValidator.isItemPickupValid(itemPickupData, character)) as IItem;
    try {
      if (!itemToBePicked) {
        return false;
      }

      const hasRaceCondition = await this.hasRaceCondition(itemToBePicked, character);

      if (hasRaceCondition) {
        return false;
      }

      const inventory = await this.characterInventory.getInventory(character);

      const isInventoryItem = itemToBePicked.isItemContainer && inventory === null;
      const isPickupFromMap =
        this.mapHelper.isCoordinateValid(itemToBePicked.x) &&
        this.mapHelper.isCoordinateValid(itemToBePicked.y) &&
        itemToBePicked.scene !== undefined;

      itemToBePicked.key = itemToBePicked.baseKey; // support picking items from a tiled map seed
      await itemToBePicked.save();

      const isPickupFromContainer = itemPickupData.fromContainerId && !isPickupFromMap;

      if (isPickupFromContainer) {
        const hasPickedUpFromContainer = await this.handlePickupFromContainer(
          itemPickupData,
          itemToBePicked,
          character
        );

        if (!hasPickedUpFromContainer) {
          return false;
        }
      }

      // we had to proceed with undefined check because remember that x and y can be 0, causing removeItemFromMap to not be triggered!
      if (isPickupFromMap) {
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
        await this.itemPickupUpdater.refreshEquipmentIfInventoryItem(character);

        await this.itemPickupUpdater.finalizePickup(itemToBePicked, character);

        return true;
      }

      if (!itemPickupData.fromContainerId && !isInventoryItem && !isPickupFromMap) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Sorry, failed to remove item from container. Origin container not found."
        );
        return false;
      }

      const hasUpdatedContainers = await this.updateContainers(itemPickupData, character, isPickupFromMap);

      if (!hasUpdatedContainers) {
        return false;
      }

      await this.itemPickupUpdater.finalizePickup(itemToBePicked, character);

      return true;
    } catch (error) {
      console.error(error);
    }
  }

  private async handlePickupFromContainer(
    itemPickupData: IItemPickup,
    itemToBePicked: IItem,
    character: ICharacter
  ): Promise<boolean> {
    const pickupFromContainer = await this.itemPickupFromContainer.pickupFromContainer(
      itemPickupData,
      itemToBePicked,
      character
    );

    if (!pickupFromContainer) {
      return false;
    }

    return true;
  }

  private async updateContainers(
    itemPickupData: IItemPickup,
    character: ICharacter,
    isPickupFromMap: boolean
  ): Promise<boolean> {
    const containerToUpdateId = itemPickupData.fromContainerId;
    const updatedContainer =
      !isPickupFromMap &&
      ((await ItemContainer.findById(containerToUpdateId).lean({
        virtuals: true,
        defaults: true,
      })) as any);

    const inventoryContainerToUpdateId = itemPickupData.toContainerId;
    const updatedInventoryContainer = (await ItemContainer.findById(inventoryContainerToUpdateId).lean({
      virtuals: true,
      defaults: true,
    })) as any;

    if ((!updatedContainer && !isPickupFromMap) || !updatedInventoryContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, error in fetching container information.");
      return false;
    }

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      inventory: updatedInventoryContainer,
      openInventoryOnUpdate: isPickupFromMap,
    };

    this.itemPickupUpdater.updateInventoryCharacter(payloadUpdate, character);

    if (!isPickupFromMap) {
      // RPG-1012 - reopen origin container using read to open with correct type
      await this.itemPickupUpdater.sendContainerRead(updatedContainer, character);
    }

    return true;
  }

  private async hasRaceCondition(itemToBePicked: IItem, character: ICharacter): Promise<boolean> {
    // this prevents item duplication (2 chars trying to pick up the same item at the same time)
    if (itemToBePicked.isBeingPickedUp) {
      this.socketMessaging.sendErrorMessageToCharacter(character);
      return true;
    }
    itemToBePicked.isBeingPickedUp = true;
    await itemToBePicked.save();

    return false;
  }
}
