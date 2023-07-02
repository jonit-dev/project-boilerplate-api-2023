import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { CharacterBuffTracker } from "@providers/character/characterBuff/CharacterBuffTracker";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { CharacterItems } from "@providers/character/characterItems/CharacterItems";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { ItemOwnership } from "@providers/item/ItemOwnership";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentSet, ItemSocketEvents, ItemSubType, ItemType } from "@rpg-engine/shared";
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

    private itemOwnership: ItemOwnership,
    private characterBuffTracker: CharacterBuffTracker,
    private characterBuffActivator: CharacterBuffActivator
  ) {}

  @TrackNewRelicTransaction()
  public async unequip(character: ICharacter, inventory: IItem, item: IItem): Promise<boolean> {
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

    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character.equipment as unknown as string);

    const bookValue = 2;
    const Accessory = await Item.findById(equipmentSlots.accessory);
    if (item.type === ItemType.Weapon && Accessory?.subType === ItemSubType.Book) {
      await Item.updateOne({ _id: item._id }, { $inc: { attack: -bookValue, defense: -bookValue } });
    }

    const updatedItem = (await Item.findById(item._id)) || item;

    const hasItemOnEquipment = await this.characterItems.hasItem(item._id, character, "equipment");

    // if we don't have the item we're trying to unequip, just abort the operation
    if (!hasItemOnEquipment) {
      return false;
    }

    const hasUnequipped = await this.performUnequipTransaction(character, updatedItem, inventoryContainerId);

    if (!hasUnequipped) {
      return false;
    }

    // send payload event to the client, informing about the change

    const inventoryContainer = await ItemContainer.findById(inventoryContainerId);

    this.socketMessaging.sendEventToUser(character.channelId!, ItemSocketEvents.EquipmentAndInventoryUpdate, {
      equipment: equipmentSlots,
      inventory: inventoryContainer,
    });

    await Item.updateOne({ _id: item._id }, { isEquipped: false });

    await this.handleBookEffect(item, equipmentSlots, bookValue);

    const newEquipmentSlots = await this.equipmentSlots.getEquipmentSlots(character.equipment as unknown as string);

    const newInventoryContainer = await ItemContainer.findById(inventoryContainerId);

    this.socketMessaging.sendEventToUser(character.channelId!, ItemSocketEvents.EquipmentAndInventoryUpdate, {
      equipment: newEquipmentSlots,
      inventory: newInventoryContainer,
    });

    if (!item.owner) {
      await this.itemOwnership.addItemOwnership(item, character);
    }

    // if by any reason the item still have a buff, lets make sure its wiped out

    const buffs = await this.characterBuffTracker.getBuffByItemId(character._id, item._id);

    for (const buff of buffs) {
      await this.characterBuffActivator.disableBuff(character, buff._id!, buff.type, true);
    }

    await this.clearCache(character);

    return true;
  }

  private async performUnequipTransaction(
    character: ICharacter,
    item: IItem,
    inventoryContainerId: string
  ): Promise<boolean> {
    try {
      //   add it to the inventory
      const addItemToInventory = await this.characterItemContainer.addItemToContainer(
        item,
        character,
        inventoryContainerId
      );

      if (!addItemToInventory) {
        return false;
      }

      await this.characterItems.deleteItemFromContainer(item._id, character, "equipment");
    } catch (error) {
      // if we couldn't remove the item from the equipment, we need to remove it from the inventory to avoid a duplicate item
      await this.characterItems.deleteItemFromContainer(item._id, character, "inventory");

      console.error(error);
      return false;
    }

    return true;
  }

  private async clearCache(character: ICharacter): Promise<void> {
    // When unequip remove data from redis
    await this.inMemoryHashTable.delete(character._id.toString(), "totalAttack");
    await this.inMemoryHashTable.delete(character._id.toString(), "totalDefense");

    await clearCacheForKey(`${character._id}-inventory`);
    await clearCacheForKey(`${character._id}-equipment`);
    await clearCacheForKey(`characterBuffs_${character._id}`);
    await clearCacheForKey(`${character._id}-skills`);
  }

  private async handleBookEffect(item: IItem, equipmentSlots: IEquipmentSet, bookValue: number): Promise<void> {
    // decrease attack and defense
    if (item.subType === ItemSubType.Book) {
      const leftHandItem = await Item.findById(equipmentSlots.leftHand);
      const rightHandItem = await Item.findById(equipmentSlots.rightHand);
      if (leftHandItem?.type === ItemType.Weapon) {
        await Item.updateOne({ _id: leftHandItem._id }, { $inc: { attack: -bookValue, defense: -bookValue } });
      }
      if (rightHandItem?.type === ItemType.Weapon) {
        await Item.updateOne({ _id: rightHandItem._id }, { $inc: { attack: -bookValue, defense: -bookValue } });
      }
    }
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
