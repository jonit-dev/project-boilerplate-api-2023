import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { EquipmentEquipInventory } from "@providers/equipment/EquipmentEquipInventory";

import { ItemMap } from "@providers/item/ItemMap";
import { ItemOwnership } from "@providers/item/ItemOwnership";
import { ItemWeightTracker } from "@providers/item/ItemWeightTracker";
import { Locker } from "@providers/locks/Locker";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";
import { CharacterInventory } from "../CharacterInventory";
import { CharacterItemSlots } from "./CharacterItemSlots";
import { CharacterItemStack } from "./CharacterItemStack";

interface IAddItemToContainerOptions {
  shouldAddOwnership?: boolean;
  isInventoryItem?: boolean;
  dropOnMapIfFull?: boolean;
  shouldAddAsCarriedItem?: boolean;
}

@provide(CharacterItemContainer)
export class CharacterItemContainer {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItemStack: CharacterItemStack,
    private characterItemSlots: CharacterItemSlots,
    private equipmentEquipInventory: EquipmentEquipInventory,
    private itemMap: ItemMap,
    private characterInventory: CharacterInventory,
    private itemOwnership: ItemOwnership,
    private itemWeightTracker: ItemWeightTracker,
    private locker: Locker,
    private inMemoryHashTable: InMemoryHashTable
  ) {}

  @TrackNewRelicTransaction()
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

        await this.inMemoryHashTable.delete("character-weights", character._id);
        await this.inMemoryHashTable.delete("character-max-weights", character._id);

        return true;
      }
    }

    await this.inMemoryHashTable.delete("character-weights", character._id);
    await this.inMemoryHashTable.delete("character-max-weights", character._id);

    return true;
  }

  @TrackNewRelicTransaction()
  public async addItemToContainer(
    item: IItem,
    character: ICharacter,
    toContainerId: string,
    options?: IAddItemToContainerOptions
  ): Promise<boolean> {
    try {
      const hasLock = await this.locker.lock(`item-${item._id}-add-item-to-container`);

      if (!hasLock) {
        return false;
      }

      const {
        shouldAddOwnership = true,
        isInventoryItem = false,
        dropOnMapIfFull = false,
        shouldAddAsCarriedItem = true,
      } = options || {};

      const itemToBeAdded = item;

      if (!itemToBeAdded) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The item to be added was not found.");
        return false;
      }

      const targetContainer = await ItemContainer.findOne({ _id: toContainerId });

      if (!targetContainer) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The target container was not found.");
        return false;
      }

      const tryToAddItemToContainer = async (): Promise<boolean> => {
        if (isInventoryItem) {
          const equipped = await this.equipmentEquipInventory.equipInventory(character, itemToBeAdded);

          if (!equipped) {
            return false;
          }

          return true;
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

          await this.itemMap.clearItemCoordinates(itemToBeAdded, targetContainer as IItemContainer);

          if (itemToBeAdded.maxStackSize > 1) {
            const wasStacked = await this.characterItemStack.tryAddingItemToStack(
              character,
              targetContainer as IItemContainer,
              itemToBeAdded
            );

            if (wasStacked || wasStacked === undefined) {
              //! wasStacked can be undefined if there was an error, on this case we just return true to avoid creating a new item. (duplicate stack bug)
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
              targetContainer as IItemContainer,
              dropOnMapIfFull
            );

            if (!result) {
              return false;
            }
          }

          return true;
        }

        return false;
      };

      const result = await tryToAddItemToContainer();

      if (result) {
        await this.inMemoryHashTable.delete("character-weights", character._id);
        await this.inMemoryHashTable.delete("character-max-weights", character._id);
      }

      if (result && shouldAddOwnership) {
        await this.itemOwnership.addItemOwnership(itemToBeAdded, character);
      }

      if (result && shouldAddAsCarriedItem) {
        await this.itemWeightTracker.setItemWeightTracking(itemToBeAdded, character);
      }

      await Item.updateOne(
        {
          _id: itemToBeAdded._id,
          scene: itemToBeAdded.scene,
        },
        {
          $set: {
            isInContainer: true,
          },
        }
      );

      return result;
    } catch (error) {
      console.error(error);
      await this.locker.unlock(`item-${item._id}-add-item-to-container`);

      return false;
    } finally {
      await this.locker.unlock(`item-${item._id}-add-item-to-container`);
    }
  }

  @TrackNewRelicTransaction()
  public async getItemContainer(character: ICharacter): Promise<IItemContainer | null> {
    const inventory = await this.characterInventory.getInventory(character);
    const inventoryContainer = await ItemContainer.findById(inventory?.itemContainer);

    if (!inventoryContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The character does not have an inventory.");
    }

    return inventoryContainer;
  }

  @TrackNewRelicTransaction()
  public async clearAllSlots(container: IItemContainer): Promise<void> {
    if (!container.slots) {
      return;
    }

    for (let i = 0; i < container.slotQty; i++) {
      container.slots[i] = null;
    }

    await container.save();
  }
}
