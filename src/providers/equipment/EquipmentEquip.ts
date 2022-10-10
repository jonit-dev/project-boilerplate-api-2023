import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IEquipmentAndInventoryUpdatePayload,
  IEquipmentSet,
  ItemSlotType,
  ItemSocketEvents,
  ItemType,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { EquipmentRangeUpdate } from "./EquipmentRangeUpdate";
import { EquipmentSlots } from "./EquipmentSlots";
import { EquipmentTwoHanded } from "./EquipmentTwoHanded";

export type SourceEquipContainerType = "inventory" | "container";

@provide(EquipmentEquip)
export class EquipmentEquip {
  constructor(
    private socketMessaging: SocketMessaging,
    private equipmentHelper: EquipmentRangeUpdate,
    private characterItemInventory: CharacterItemInventory,
    private equipmentSlots: EquipmentSlots,
    private characterValidation: CharacterValidation,
    private equipmentTwoHanded: EquipmentTwoHanded
  ) {}

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
      return false;
    }

    const equipment = await Equipment.findById(character.equipment);

    if (!equipment) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, equipment not found.");
      return false;
    }

    const equipItem = await this.equipmentSlots.addItemToEquipmentSlot(character, item, equipment, itemContainer);

    if (!equipItem) {
      return false;
    }

    const inventory = await character.inventory;

    const inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as any;

    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(equipment._id);
    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      equipment: equipmentSlots,
      inventory: inventoryContainer,
    };

    this.updateItemInventoryCharacter(payloadUpdate, character);

    await this.equipmentHelper.updateCharacterAttackType(character, item as any);

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

  private async isEquipValid(
    character: ICharacter,
    item: IItem,
    containerType: SourceEquipContainerType
  ): Promise<boolean> {
    const hasBasicValidation = await this.characterValidation.hasBasicValidation(character);

    if (!hasBasicValidation) {
      return false;
    }

    if (containerType === "inventory") {
      // if item is coming from a character's inventory, check if the character owns the item

      const isItemInInventory = await this.characterItemInventory.checkItemInInventory(item._id, character);

      if (!isItemInInventory) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Sorry, you don't have this item in your inventory."
        );
        return false;
      }
    }

    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character.equipment as unknown as string);

    const hasTwoHandedItemEquipped = await this.equipmentTwoHanded.hasTwoHandedItemEquipped(
      equipmentSlots as unknown as IEquipmentSet
    );

    if (hasTwoHandedItemEquipped && this.equipmentTwoHanded.isItemEquippableOnHands(item)) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you already have a two-handed item equipped."
      );

      return false;
    }

    if (item.isTwoHanded) {
      const canEquipTwoHanded = await this.equipmentTwoHanded.checkTwoHandedEquip(
        equipmentSlots as unknown as IEquipmentSet
      );
      if (!canEquipTwoHanded) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Sorry, you already have an item equipped on your hands."
        );

        return false;
      }
    }

    return true;
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
}
