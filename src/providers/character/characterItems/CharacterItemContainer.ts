import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";
import { CharacterItemSlots } from "./CharacterItemSlots";
import { CharacterItemStack } from "./CharacterItemStack";

@provide(CharacterItemContainer)
export class CharacterItemContainer {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItemStack: CharacterItemStack,
    private characterItemSlots: CharacterItemSlots
  ) {}

  public async addItemToContainer(item: IItem, character: ICharacter, toContainerId: string): Promise<boolean> {
    const itemToBeAdded = (await Item.findById(item.id)) as unknown as IItem;

    if (!itemToBeAdded) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The item to be added was not found.");
      return false;
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

      if (itemToBeAdded.isStackable) {
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
        const result = await this.characterItemSlots.addItemOnFirstAvailableSlot(
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
}
