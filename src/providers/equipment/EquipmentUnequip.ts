import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { CharacterItems } from "@providers/character/characterItems/CharacterItems";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";

import { CharacterValidation } from "@providers/character/CharacterValidation";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { EquipmentRangeUpdate } from "./EquipmentRangeUpdate";
import { EquipmentSlots } from "./EquipmentSlots";

@provide(EquipmentUnequip)
export class EquipmentUnequip {
  constructor(
    private equipmentSlots: EquipmentSlots,
    private equipmentHelper: EquipmentRangeUpdate,
    private characterValidation: CharacterValidation,
    private socketMessaging: SocketMessaging,
    private characterItems: CharacterItems,
    private characterItemSlots: CharacterItemSlots
  ) {}

  public async unequip(character: ICharacter, inventory: IItem, item: IItem): Promise<boolean> {
    const inventoryContainerId = inventory.itemContainer as unknown as string;

    if (!inventoryContainerId) {
      throw new Error("Inventory container id is not defined.");
    }

    if (!character.equipment) {
      this.socketMessaging.sendErrorMessageToCharacter(character);
      return false;
    }

    const canUnequip = await this.isUnequipValid(character, item, inventoryContainerId);

    if (!canUnequip) {
      return false;
    }

    //   add it to the inventory

    const addItemToInventory = await this.characterItems.addItemToContainer(item, character, inventoryContainerId);

    if (!addItemToInventory) {
      return false;
    }

    const hasItemOnEquipment = await this.characterItems.hasItem(item._id, character, "equipment");

    if (hasItemOnEquipment) {
      try {
        await this.characterItems.deleteItemFromContainer(item._id, character, "equipment");
      } catch (error) {
        // if we couldn't remove the item from the equipment, we need to remove it from the inventory to avoid a duplicate item
        await this.characterItems.deleteItemFromContainer(item._id, character, "inventory");

        console.error(error);
        return false;
      }
    }

    // send payload event to the client, informing about the change

    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character.equipment as unknown as string);

    const inventoryContainer = await ItemContainer.findById(inventoryContainerId);

    this.socketMessaging.sendEventToUser(character.channelId!, ItemSocketEvents.EquipmentAndInventoryUpdate, {
      equipment: equipmentSlots,
      inventory: inventoryContainer,
    });

    await this.equipmentHelper.updateCharacterAttackType(character, item);

    return true;
  }

  private async isUnequipValid(character: ICharacter, item: IItem, inventoryContainerId: string): Promise<boolean> {
    const baseValidation = this.characterValidation.hasBasicValidation(character);

    if (!baseValidation) {
      return false;
    }

    const hasItemToBeUnequipped = await this.characterItems.hasItem(item._id, character, "equipment");

    if (!hasItemToBeUnequipped) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you cannot unequip an item that you don't have."
      );
      return false;
    }

    const hasSlotsAvailable = await this.characterItemSlots.hasAvailableSlot(inventoryContainerId, item);

    if (!hasSlotsAvailable) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, your inventory is full.");
      return false;
    }

    if (!item) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry! Item not found.");
      return false;
    }

    return true;
  }
}
