import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { CharacterItemBuff } from "@providers/character/characterBuff/CharacterItemBuff";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { BerserkerPassiveHabilities } from "@providers/character/characterPassiveHabilities/BerserkerPassiveHabilities";
import { RoguePassiveHabilities } from "@providers/character/characterPassiveHabilities/RoguePassiveHabilities";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { ItemOwnership } from "@providers/item/ItemOwnership";
import { ItemPickupUpdater } from "@providers/item/ItemPickup/ItemPickupUpdater";
import { ItemView } from "@providers/item/ItemView";
import { itemsBlueprintIndex } from "@providers/item/data";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  CharacterClass,
  IBaseItemBlueprint,
  IEquipmentAndInventoryUpdatePayload,
  ISkill,
  ItemSlotType,
  ItemSocketEvents,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { EquipmentCharacterClass } from "./ EquipmentCharacterClass";
import { EquipmentSlots } from "./EquipmentSlots";
import { EquipmentTwoHanded } from "./EquipmentTwoHanded";

export type SourceEquipContainerType = "inventory" | "container";

@provide(EquipmentEquip)
export class EquipmentEquip {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItemInventory: CharacterItemInventory,
    private equipmentSlots: EquipmentSlots,
    private characterValidation: CharacterValidation,
    private equipmentTwoHanded: EquipmentTwoHanded,
    private itemOwnership: ItemOwnership,
    private characterInventory: CharacterInventory,
    private inMemoryHashTable: InMemoryHashTable,
    private itemView: ItemView,
    private berserkerPassiveHabilities: BerserkerPassiveHabilities,
    private roguePassiveHabilities: RoguePassiveHabilities,
    private characterWeight: CharacterWeight,
    private itemPickupUpdater: ItemPickupUpdater,
    private characterItemBuff: CharacterItemBuff,
    private equipmentCharacterClass: EquipmentCharacterClass
  ) {}

  public async equipInventory(character: ICharacter, itemId: string): Promise<boolean> {
    const item = await Item.findById(itemId);
    let inventory = await this.characterInventory.getInventory(character);

    if (!item) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, item not found.");
      return false;
    }
    item.isBeingEquipped = true;
    await item.save();

    const isItemInventory = item.isItemContainer;

    // if its not an item container, or the use already has an inventory, this method shouldnt have been called.
    if (!isItemInventory || inventory) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you can't equip this as an inventory.");
      return false;
    }

    const equipment = await Equipment.findById(character.equipment);

    if (!equipment) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, equipment not found.");
      return false;
    }

    equipment.inventory = item._id;
    await equipment.save();

    inventory = await this.characterInventory.getInventory(character);

    if (!inventory) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, inventory not found.");
      return false;
    }

    const inventoryContainer = await ItemContainer.findById(inventory.itemContainer);

    if (!inventoryContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, inventory container not found.");
      return false;
    }

    await this.itemView.removeItemFromMap(item);

    await this.finalizeEquipItem(inventoryContainer, equipment, item, character);

    return true;
  }

  public async equip(character: ICharacter, itemId: string, fromItemContainerId: string): Promise<boolean> {
    const item = await Item.findById(itemId);

    if (!item) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, item not found.");
      return false;
    }

    const itemContainer = await ItemContainer.findById(fromItemContainerId);

    if (!itemContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, item container not found.");
      return false;
    }

    const containerType = await this.checkContainerType(itemContainer);

    const isEquipValid = await this.isEquipValid(character, item, containerType);

    if (!isEquipValid) {
      this.socketMessaging.sendErrorMessageToCharacter(character);
      return false;
    }

    const equipment = await Equipment.findById(character.equipment);

    if (!equipment) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, equipment not found.");
      return false;
    }

    if (item.isBeingEquipped) {
      this.socketMessaging.sendErrorMessageToCharacter(character);
      return false;
    }

    item.isBeingEquipped = true;

    const equipItem = await this.equipmentSlots.addItemToEquipmentSlot(character, item, equipment, itemContainer);

    if (!equipItem) {
      return false;
    }

    const inventory = await this.characterInventory.getInventory(character);

    const inventoryContainer = (await ItemContainer.findById(inventory?.itemContainer)) as any;

    if (!inventoryContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Failed to equip item.");
      return false;
    }

    await item.save();

    // refresh itemContainer from which the item was equipped
    const updatedContainer = (await ItemContainer.findById(fromItemContainerId)) as any;
    await this.itemPickupUpdater.sendContainerRead(updatedContainer, character);

    await this.finalizeEquipItem(inventoryContainer, equipment, item, character);

    return true;
  }

  public updateItemInventoryCharacter(
    equipmentAndInventoryUpdate: IEquipmentAndInventoryUpdatePayload,
    character: ICharacter
  ): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      equipmentAndInventoryUpdate
    );
  }

  public getAllowedItemTypes(): ItemType[] {
    const allowedItemTypes: ItemType[] = [];

    for (const allowedItemType of Object.keys(ItemType)) {
      allowedItemTypes.push(ItemType[allowedItemType]);
    }

    return allowedItemTypes;
  }

  private async finalizeEquipItem(
    inventoryContainer: IItemContainer,
    equipment: IEquipment,
    item: IItem,
    character: ICharacter
  ): Promise<void> {
    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(equipment._id);
    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      equipment: equipmentSlots,
      inventory: inventoryContainer as any,
    };

    this.updateItemInventoryCharacter(payloadUpdate, character);

    // if no owner, add item ownership
    if (!item.owner) {
      await this.itemOwnership.addItemOwnership(item, character);
    }

    await Item.updateOne({ _id: item._id }, { isEquipped: true });

    // make sure it does not save coordinates here
    if (item.x || item.y || item.scene) {
      await Item.updateOne({ _id: item._id }, { $unset: { x: "", y: "", scene: "" } });
    }

    // set isBeingEquipped to false (lock mechanism)
    await Item.updateOne({ _id: item._id }, { $set: { isBeingEquipped: false } });

    // When Equip remove data from redis
    await this.inMemoryHashTable.delete(character._id.toString(), "totalAttack");
    await this.inMemoryHashTable.delete(character._id.toString(), "totalDefense");

    await this.characterWeight.updateCharacterWeight(character);

    await this.characterItemBuff.enableItemBuff(character, item);
  }

  private async checkContainerType(itemContainer: IItemContainer): Promise<SourceEquipContainerType> {
    if (!itemContainer) {
      throw new Error("Item container not found");
    }

    const parentItem = await Item.findById(itemContainer.parentItem);

    if (!parentItem) {
      throw new Error("Parent item not found");
    }

    if (parentItem.allowedEquipSlotType?.includes(ItemSlotType.Inventory)) {
      return "inventory";
    }

    return "container";
  }

  private async isEquipValid(
    character: ICharacter,
    item: IItem,
    containerType: SourceEquipContainerType
  ): Promise<boolean> {
    const allowedSubTypes = [ItemSubType.Book, ItemSubType.Shield];

    if (item.type === ItemType.Weapon || allowedSubTypes.includes(item.subType as ItemSubType)) {
      const isItemAllowed = this.equipmentCharacterClass.isItemAllowed(character.class, item.subType);

      if (!isItemAllowed) {
        const errorMessage = `Sorry, your class is not allowed to use ${item.subType.toLowerCase()} type items.`;

        // Send the error message to the character
        this.socketMessaging.sendErrorMessageToCharacter(character, errorMessage);

        return false;
      }
    }

    const hasBasicValidation = await this.characterValidation.hasBasicValidation(character);

    if (!hasBasicValidation) {
      return false;
    }

    // Check if the character meets the minimum requirements to use the item

    const itemBlueprint = itemsBlueprintIndex[item.key] as IBaseItemBlueprint;

    if (itemBlueprint?.minRequirements) {
      const meetsMinRequirements = await this.checkMinimumRequirements(character, itemBlueprint);

      if (!meetsMinRequirements) {
        // Destructure properties from item.minRequirements for readability
        const { level, skill } = itemBlueprint.minRequirements!;

        // Prepare an error message to inform the character about the unmet requirements
        const message = `Sorry, you don't have the minimum requirements to equip this item: level ${level}, ${skill.name} level ${skill.level}`;

        // Send the error message to the character
        this.socketMessaging.sendErrorMessageToCharacter(character, message);

        return false;
      }
    }

    if (containerType === "inventory") {
      // if item is coming from a character's inventory, check if the character owns the item

      const allItemsInInventory = await this.characterItemInventory.getAllItemsFromInventoryNested(character);

      const isItemInInventory = allItemsInInventory.some(
        (inventoryItem) => inventoryItem._id.toString() === item._id.toString()
      );

      if (!isItemInInventory) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Sorry, you don't have this item in your inventory."
        );
        return false;
      }
    }

    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character.equipment as unknown as string);

    const validateItemsEquip = await this.equipmentTwoHanded.validateHandsItemEquip(equipmentSlots, item, character);

    if (!validateItemsEquip) {
      if (character.class === CharacterClass.Berserker) {
        return await this.berserkerPassiveHabilities.canBerserkerEquipItem(character._id, item._id);
      }

      if (character.class === CharacterClass.Rogue) {
        return await this.roguePassiveHabilities.rogueWeaponHandler(character._id, item._id);
      }

      return false;
    }

    return true;
  }

  private async checkMinimumRequirements(character: ICharacter, itemBlueprint: IBaseItemBlueprint): Promise<boolean> {
    // Fetch the character's skill from the database
    const skill = (await Skill.findById(character.skills).lean()) as ISkill;

    const minRequirements = itemBlueprint?.minRequirements;

    if (!minRequirements) return true;

    // Check if the character's skill level is less than the required level
    if (skill.level < minRequirements.level) return false;

    // Fetch the specific skill level from the character's skills
    const skillsLevel: number = skill[minRequirements.skill.name]?.level ?? 0;

    // Check if the character's specific skill level is less than the required level
    if (skillsLevel < minRequirements.skill.level) return false;

    // Return true if the character meets all the minimum requirements
    return true;
  }
}
