import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
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

@provide(ItemContainerOpen)
export class ItemContainerOpen {
  constructor(
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging,
    private movementHelper: MovementHelper
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

      this.socketMessaging.sendEventToUser<IItemContainerRead>(character.channelId!, ItemSocketEvents.ContainerRead, {
        itemContainer,
      });
    }
  }

  private async isContainerOpenValid(itemContainer: IItemContainer, character: ICharacter): Promise<boolean> {
    // if we have an owner and its not the character, return false

    if (itemContainer.owner) {
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
