import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { IPosition, MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  FromGridX,
  FromGridY,
  IEquipmentAndInventoryUpdatePayload,
  IItemContainer,
  IItemDrop,
  ItemSocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { clearCacheForKey } from "speedgoose";
import { CharacterItems } from "../character/characterItems/CharacterItems";
import { ItemDropCleanup } from "./ItemDropCleanup";
import { ItemOwnership } from "./ItemOwnership";

@provide(ItemDrop)
export class ItemDrop {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItems: CharacterItems,
    private equipmentSlots: EquipmentSlots,
    private characterValidation: CharacterValidation,
    private movementHelper: MovementHelper,
    private characterWeight: CharacterWeight,
    private itemOwnership: ItemOwnership,
    private characterInventory: CharacterInventory,
    private itemCleanup: ItemDropCleanup,
    private inMemoryHashTable: InMemoryHashTable
  ) {}

  //! For now, only a drop from inventory or equipment set is allowed.
  @TrackNewRelicTransaction()
  public async performItemDrop(itemDropData: IItemDrop, character: ICharacter): Promise<boolean> {
    const isDropValid = await this.isItemDropValid(itemDropData, character);
    const source = itemDropData.source;
    if (!isDropValid) {
      return false;
    }

    const itemToBeDropped = await Item.findById(itemDropData.itemId);

    if (!itemToBeDropped) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, item to be dropped wasn't found.");
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
            this.socketMessaging.sendErrorMessageToCharacter(character);
            return false;
          }

          const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(
            character._id,
            character.equipment as unknown as string
          );

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
            this.socketMessaging.sendErrorMessageToCharacter(character);
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

      await clearCacheForKey(`${character._id}-inventory`);

      await this.inMemoryHashTable.delete("character-weapon", character._id);

      await this.inMemoryHashTable.delete("character-weights", character._id);
      await this.inMemoryHashTable.delete("character-max-weights", character._id);

      return true;
    } catch (err) {
      this.socketMessaging.sendErrorMessageToCharacter(character);

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
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you're trying to drop this item too far away."
      );
      return false;
    }

    // update x, y, scene and unset owner, using updateOne

    await Item.updateOne(
      { _id: dropItem._id },
      {
        $set: {
          x: targetX,
          y: targetY,
          scene: character.scene,
          droppedBy: character._id,
        },
      }
    );

    await this.itemCleanup.tryCharacterDroppedItemsCleanup(character);

    await this.itemOwnership.removeItemOwnership(dropItem);

    return true;
  }

  private async removeItemFromEquipmentSet(item: IItem, character: ICharacter): Promise<boolean> {
    const equipmentSetId = character.equipment;
    const equipmentSet = await Equipment.findById(equipmentSetId).cacheQuery({
      cacheKey: `${character._id}-equipment`,
    });

    if (!equipmentSet) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, equipment set not found.");
      return false;
    }

    const wasItemDeleted = await this.characterItems.deleteItemFromContainer(item._id, character, "equipment");

    if (!wasItemDeleted) {
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
      this.socketMessaging.sendErrorMessageToCharacter(character);
      return false;
    }

    if (!targetContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character);
      return false;
    }

    const wasItemDeleted = await this.characterItems.deleteItemFromContainer(item._id, character, "inventory");

    if (!wasItemDeleted) {
      return false;
    }

    return true;
  }

  private async isItemDropValid(itemDrop: IItemDrop, character: ICharacter): Promise<Boolean> {
    const item = await Item.findById(itemDrop.itemId);
    const isFromEquipmentSet = itemDrop.source === "equipment";

    if (!item) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, this item is not accessible.");
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
    const inventory = await this.characterInventory.getInventory(character);

    if (!inventory) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you must have a bag or backpack to drop this item."
      );
      return false;
    }

    const inventoryContainer = await ItemContainer.findById(inventory.itemContainer);

    if (!inventoryContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, inventory container not found.");
      return false;
    }

    const hasItemInInventory = inventoryContainer?.itemIds?.find(
      (itemId) => String(itemId) === String(itemDrop.itemId)
    );

    if (!hasItemInInventory) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you do not have this item in your inventory."
      );
      return false;
    }

    if (itemDrop.fromContainerId.toString() !== inventoryContainer?.id.toString()) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, this item does not belong to your inventory."
      );
      return false;
    }

    if (!inventoryContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you must have a bag or backpack to drop this item."
      );
      return false;
    }

    return true;
  }

  public async dropItems(items: IItem[], droppintPoints: IPosition[], scene: string): Promise<void> {
    for (const i in droppintPoints) {
      items[i].x = FromGridX(droppintPoints[i].x);
      items[i].y = FromGridY(droppintPoints[i].y);
      items[i].scene = scene;

      await items[i].save();
    }
  }

  private sendRefreshItemsEvent(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }
}
