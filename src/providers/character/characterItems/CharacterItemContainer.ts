import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EquipmentEquipInventory } from "@providers/equipment/EquipmentEquipInventory";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";
import { CharacterItemSlots } from "./CharacterItemSlots";
import { CharacterItemStack } from "./CharacterItemStack";

@provide(CharacterItemContainer)
export class CharacterItemContainer {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItemStack: CharacterItemStack,
    private characterItemSlots: CharacterItemSlots,
    private equipmentEquipInventory: EquipmentEquipInventory
  ) {}

  public async removeItemFromContainer(
    item: IItem,
    character: ICharacter,
    fromContainer: IItemContainer
  ): Promise<boolean> {
    const itemToBeRemoved = item;

    if (!itemToBeRemoved) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The item to be removed was not found.");
      return false;
    }

    if (!fromContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The origin container was not found.");
      return false;
    }

    for (let i = 0; i < fromContainer.slotQty; i++) {
      const slotItem = fromContainer.slots?.[i];

      if (!slotItem) continue;
      if (slotItem._id.toString() === item._id.toString()) {
        fromContainer.slots[i] = null;

        await ItemContainer.updateOne(
          {
            _id: fromContainer._id,
          },
          {
            $set: {
              slots: {
                ...fromContainer.slots,
              },
            },
          }
        );

        return true;
      }
    }

    return true;
  }

  public async addItemToContainer(
    item: IItem,
    character: ICharacter,
    toContainerId: string,
    isInventoryItem: boolean = false
  ): Promise<boolean> {
    const itemToBeAdded = item;

    if (!itemToBeAdded) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The item to be added was not found.");
      return false;
    }

    if (isInventoryItem) {
      const equipped = await this.equipmentEquipInventory.equipInventory(character, itemToBeAdded);

      if (!equipped) {
        return false;
      }

      return true;
    }

    const targetContainer = (await ItemContainer.findById(toContainerId)) as unknown as IItemContainer;

    if (!targetContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The target container was not found.");
      return false;
    }

    if (targetContainer) {
      let isNewItem = true;

      // Item Type is valid to add to a container?
      const isItemTypeValid = targetContainer.allowedItemTypes?.filter((entry) => {
        return entry === itemToBeAdded?.type;
      });
      if (!isItemTypeValid) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Oops! The item type is not valid for this container."
        );
        return false;
      }

      // Inventory is empty, slot checking not needed
      if (targetContainer.isEmpty) isNewItem = true;

      if (itemToBeAdded.maxStackSize > 1) {
        const wasStacked = await this.characterItemStack.tryAddingItemToStack(
          character,
          targetContainer,
          itemToBeAdded
        );

        if (wasStacked) {
          return true;
        } else {
          isNewItem = true;
        }
      }

      // Check's done, need to create new item on char inventory
      if (isNewItem) {
        const result = await this.characterItemSlots.tryAddingItemOnFirstSlot(
          character,
          itemToBeAdded,
          targetContainer
        );

        if (!result) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  public async getItemContainer(character: ICharacter): Promise<IItemContainer | null> {
    const inventory = await character.inventory;
    const inventoryContainer = await ItemContainer.findById(inventory?.itemContainer);

    if (!inventoryContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The character does not have an inventory.");
    }

    return inventoryContainer;
  }
}
