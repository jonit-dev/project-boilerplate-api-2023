import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { CharacterItems } from "@providers/character/characterItems/CharacterItems";
import { MapHelper } from "@providers/map/MapHelper";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IItemPickup } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ItemPickupValidator)
export class ItemPickupValidator {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItemSlots: CharacterItemSlots,
    private mapHelper: MapHelper,
    private characterWeight: CharacterWeight,
    private movementHelper: MovementHelper,
    private characterItems: CharacterItems,
    private characterValidation: CharacterValidation
  ) {}

  public async isItemPickupValid(itemPickupData: IItemPickup, character: ICharacter): Promise<boolean | IItem> {
    const item = (await Item.findById(itemPickupData.itemId)) as unknown as IItem;

    const inventory = await character.inventory;

    if (!item) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, the item to be picked up was not found.");
      return false;
    }

    const isInventoryItem = item.isItemContainer && inventory === null;

    if (isInventoryItem) {
      // validate if equipment container exists
      const equipmentContainer = await Equipment.findById(character.equipment);

      if (!equipmentContainer) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, equipment container not found");
        return false;
      }
    }

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

    const isItemOnMap =
      this.mapHelper.isCoordinateValid(item.x) && this.mapHelper.isCoordinateValid(item.y) && item.scene;

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

      if (item.owner && item.owner?.toString() !== character._id.toString()) {
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
    if (characterAlreadyHasItem && itemPickupData.toContainerId === inventory._id.toString()) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you already have this item.");
      return false;
    }

    const hasBasicValidation = this.characterValidation.hasBasicValidation(character);

    if (!hasBasicValidation) {
      return false;
    }

    return item;
  }
}
