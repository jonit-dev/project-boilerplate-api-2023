import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { CharacterItems } from "@providers/character/characterItems/CharacterItems";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { clearCacheForKey } from "speedgoose";
import { EquipmentSlots } from "./EquipmentSlots";

@provide(EquipmentUnequip)
export class EquipmentUnequip {
  constructor(
    private equipmentSlots: EquipmentSlots,
    private characterValidation: CharacterValidation,
    private socketMessaging: SocketMessaging,
    private characterItems: CharacterItems,
    private characterItemSlots: CharacterItemSlots,
    private characterItemContainer: CharacterItemContainer,
    private inMemoryHashTable: InMemoryHashTable,
    private newRelic: NewRelic
  ) {}

  public async unequip(character: ICharacter, inventory: IItem, item: IItem): Promise<boolean> {
    return await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "EquipmentUnequip.unequip",
      async () => {
        if (!inventory) {
          this.socketMessaging.sendErrorMessageToCharacter(
            character,
            "Sorry! You cannot unequip an item without an inventory. Drop it, instead."
          );
          return false;
        }

        const inventoryContainerId = inventory?.itemContainer as unknown as string;

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

        const addItemToInventory = await this.characterItemContainer.addItemToContainer(
          item,
          character,
          inventoryContainerId
        );

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

        await Item.updateOne({ _id: item._id }, { isEquipped: false });

        // When unequip remove data from redis
        await this.inMemoryHashTable.delete(character._id.toString(), "totalAttack");
        await this.inMemoryHashTable.delete(character._id.toString(), "totalDefense");

        await clearCacheForKey(`${character._id}-inventory`);
        await clearCacheForKey(`${character._id}-equipment`);
        await clearCacheForKey(`characterBuffs_${character._id}`);
        await clearCacheForKey(`${character._id}-skills`);

        return true;
      }
    );
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
