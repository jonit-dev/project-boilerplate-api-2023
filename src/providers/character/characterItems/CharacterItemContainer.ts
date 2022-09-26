import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { EquipmentEquip } from "@providers/equipment/EquipmentEquip";
import { OperationStatus } from "@providers/types/ValidationTypes";
import { provide } from "inversify-binding-decorators";
import { ICharacterItemResult } from "./CharacterItems";
import { CharacterItemSlots } from "./CharacterItemSlots";
import { CharacterItemStack } from "./CharacterItemStack";

@provide(CharacterItemContainer)
export class CharacterItemContainer {
  constructor(
    private equipmentEquip: EquipmentEquip,
    private characterItemStack: CharacterItemStack,
    private characterItemSlots: CharacterItemSlots
  ) {}

  public async addItemToContainer(
    item: IItem,
    character: ICharacter,
    toContainerId: string,
    isEquipment?: boolean
  ): Promise<ICharacterItemResult> {
    const selectedItem = (await Item.findById(item.id)) as unknown as IItem;

    if (!selectedItem) {
      return {
        status: OperationStatus.Error,
        message: "Oops! The item to be added was not found.",
      };
    }

    if (isEquipment) {
      await this.equipmentEquip.equip(character, item.id, "");
      return {
        status: OperationStatus.Success,
      };
    }

    const targetContainer = (await ItemContainer.findById(toContainerId)) as unknown as IItemContainer;

    if (!targetContainer) {
      return {
        status: OperationStatus.Error,
        message: "Oops! The target container was not found.",
      };
    }

    if (targetContainer) {
      let isNewItem = true;

      // Item Type is valid to add to a container?
      const isItemTypeValid = targetContainer.allowedItemTypes?.filter((entry) => {
        return entry === selectedItem?.type;
      });
      if (!isItemTypeValid) {
        return {
          status: OperationStatus.Error,
          message: "Sorry, your inventory does not support this item type.",
        };
      }

      // Inventory is empty, slot checking not needed
      if (targetContainer.isEmpty) isNewItem = true;

      if (selectedItem.isStackable) {
        const wasStacked = await this.characterItemStack.tryAddingItemToStack(targetContainer, selectedItem);

        if (wasStacked?.status === OperationStatus.Error) {
          return {
            status: wasStacked.status,
            message: wasStacked.message,
          };
        }

        if (wasStacked?.status === OperationStatus.Success) {
          isNewItem = false;
        }
      }

      // Check's done, need to create new item on char inventory
      if (isNewItem) {
        const result = await this.characterItemSlots.addNewItemOnFirstAvailableSlot(selectedItem, targetContainer);

        if (result?.status === OperationStatus.Error) {
          return {
            status: result?.status,
            message: result?.message,
          };
        }
      }

      return {
        status: OperationStatus.Success,
      };
    }

    return {
      status: OperationStatus.Error,
      message: "Oops! Something went wrong while trying to add item to container.",
    };
  }
}
