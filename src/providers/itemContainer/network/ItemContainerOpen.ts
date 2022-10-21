import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  IItemContainer,
  IItemContainerOpen,
  IItemContainerRead,
  ItemSocketEvents,
  IUIShowMessage,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ItemContainerHelper } from "../ItemContainerHelper";

@provide(ItemContainerOpen)
export class ItemContainerOpen {
  constructor(
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging,
    private movementHelper: MovementHelper,
    private itemContainerHelper: ItemContainerHelper
  ) {}

  public onOpen(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      ItemSocketEvents.ContainerOpen,
      async (data: IItemContainerOpen, character) => {
        await this.openContainer(data, character);
      }
    );
  }

  public onInventoryOpen(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, ItemSocketEvents.InventoryOpen, async (data, character) => {
      await this.openInventory(character);
    });
  }

  public async openInventory(character: ICharacter): Promise<void> {
    const inventory = (await character.inventory) as unknown as IItem;

    if (!inventory || !inventory.itemContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you don’t have an inventory.");
      return;
    }

    await this.openContainer({ itemId: inventory._id }, character);
  }

  public async openContainer(data: IItemContainerOpen, character: ICharacter): Promise<void> {
    const item = await Item.findById(data.itemId);

    if (!item) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Sorry, this item is not accessible.",
        type: "error",
      });
      return;
    }

    const itemContainer = (await ItemContainer.findById(item.itemContainer)) as unknown as IItemContainer;

    if (!itemContainer) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Container not found.",
        type: "error",
      });
      return;
    }

    const isContainerOpenValid = await this.isContainerOpenValid(itemContainer, character);

    if (isContainerOpenValid) {
      // if container opening is valid, send back container information

      try {
        const type = await this.itemContainerHelper.getContainerType(itemContainer);

        if (!type) {
          throw new Error("Failed to get item type");
        }

        this.socketMessaging.sendEventToUser<IItemContainerRead>(character.channelId!, ItemSocketEvents.ContainerRead, {
          itemContainer,
          type,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  private async isContainerOpenValid(itemContainer: IItemContainer, character: ICharacter): Promise<boolean> {
    // if we have an owner and its not the character, return false

    if (itemContainer.owner && itemContainer.isOwnerRestricted) {
      if (itemContainer.owner.toString() !== character.id.toString()) {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "You can't open this container because it's not yours.",
          type: "error",
        });
        return false;
      }
    }

    const parentItem = await Item.findById(itemContainer.parentItem);

    if (!parentItem) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Sorry, this container origin item is not accessible.",
        type: "error",
      });
      return false;
    }

    if (parentItem.x && parentItem.y) {
      // this range check is only valid if the container is on the map!

      const isUnderRange = this.movementHelper.isUnderRange(character.x, character.y, parentItem.x, parentItem.y, 1);

      if (!isUnderRange) {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "Sorry, you are too far away to open this container.",
          type: "error",
        });
        return false;
      }
    }

    if (!character.isOnline) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Sorry, you must be online to open this container.",
        type: "error",
      });
      return false;
    }

    if (character.isBanned) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Sorry, you are banned and can't open this container.",
        type: "error",
      });
      return false;
    }

    return true;
  }
}
