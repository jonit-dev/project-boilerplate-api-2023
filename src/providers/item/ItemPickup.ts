import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentAndInventoryUpdatePayload, IItemPickup, ItemSocketEvents, ItemType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ItemOwnership } from "./ItemOwnership";
import { ItemView } from "./ItemView";

import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemPickupFromContainer } from "./ItemPickup/ItemPickupFromContainer";
import { ItemPickupMapContainer } from "./ItemPickup/ItemPickupMapContainer";
import { ItemPickupValidator } from "./ItemPickup/ItemPickupValidator";
@provide(ItemPickup)
export class ItemPickup {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterWeight: CharacterWeight,
    private itemView: ItemView,

    private characterItemContainer: CharacterItemContainer,
    private equipmentSlots: EquipmentSlots,
    private itemOwnership: ItemOwnership,
    private itemPickupFromContainer: ItemPickupFromContainer,
    private itemPickupValidator: ItemPickupValidator,
    private itemPickupMapContainer: ItemPickupMapContainer
  ) {}

  public async performItemPickup(itemPickupData: IItemPickup, character: ICharacter): Promise<boolean> {
    const inventory = await character.inventory;
    const itemToBePicked = (await this.itemPickupValidator.isItemPickupValid(itemPickupData, character)) as IItem;

    if (!itemToBePicked) {
      return false;
    }

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

    const addToContainer = await this.characterItemContainer.addItemToContainer(
      itemToBePicked,
      character,
      itemPickupData.toContainerId,
      isInventoryItem,
      itemPickupData.fromContainerId
    );

    if (!addToContainer) {
      return false;
    }

    // whenever a new item is added, we need to update the character weight
    await this.characterWeight.updateCharacterWeight(character);

    // we had to proceed with undefined check because remember that x and y can be 0, causing removeItemFromMap to not be triggered!
    if (isPickupFromMapContainer) {
      const pickupFromMap = await this.itemPickupMapContainer.pickupFromMapContainer(itemToBePicked, character);

      if (!pickupFromMap) {
        return false;
      }
    }

    if (isInventoryItem) {
      await this.refreshEquipmentIfInventoryItem(character);

      await this.itemOwnership.addItemOwnership(itemToBePicked, character);

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
    const updatedContainer = (await ItemContainer.findById(containerToUpdateId)) as any;

    if (!updatedContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, fetch container information.");
      return false;
    }

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      inventory: updatedContainer,
    };

    this.updateInventoryCharacter(payloadUpdate, character);

    await this.itemOwnership.addItemOwnership(itemToBePicked, character);

    return true;
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

  public getAllowedItemTypes(): ItemType[] {
    const allowedItemTypes: ItemType[] = [];

    for (const allowedItemType of Object.keys(ItemType)) {
      allowedItemTypes.push(ItemType[allowedItemType]);
    }

    return allowedItemTypes;
  }
}
