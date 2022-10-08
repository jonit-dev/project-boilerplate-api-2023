import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterItems } from "@providers/character/characterItems/CharacterItems";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";

import { CharacterValidation } from "@providers/character/CharacterValidation";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { OperationStatus } from "@providers/types/ValidationTypes";
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
    private characterItemSlots: CharacterItemSlots,
    private characterItemContainer: CharacterItemContainer
  ) {}

  public async unequip(character: ICharacter, inventory: IItem, item: IItem): Promise<void> {
    const inventoryContainerId = inventory.itemContainer as unknown as string;

    if (!inventoryContainerId) {
      throw new Error("Inventory container id is not defined.");
    }

    const canUnequip = await this.isUnequipValid(character, item, inventoryContainerId);

    if (!canUnequip) {
      return;
    }

    //   add it to the inventory

    const addItemToInventory = await this.characterItemContainer.addItemToContainer(
      item,
      character,
      inventoryContainerId
    );

    if (!addItemToInventory || addItemToInventory.status === OperationStatus.Error) {
      console.log(addItemToInventory.message);
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        addItemToInventory.message || "Sorry, failed to add item to inventory."
      );
    }

    // then remove item from equipment slot

    const deleteItemFromEquipment = await this.characterItems.deleteItem(item._id, character, "equipment");

    if (!deleteItemFromEquipment || deleteItemFromEquipment.status === OperationStatus.Error) {
      console.log(deleteItemFromEquipment.message);
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        deleteItemFromEquipment.message || "Sorry, failed to remove item from equipment."
      );
    }

    // send payload event to the client, informing about the change
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

    return true;
  }
}
