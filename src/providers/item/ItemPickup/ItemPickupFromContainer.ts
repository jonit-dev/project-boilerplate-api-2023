import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { IItemContainer, IItemPickup } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ItemPickupUpdater } from "./ItemPickupUpdater";

@provide(ItemPickupFromContainer)
export class ItemPickupFromContainer {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItemSlots: CharacterItemSlots,
    private itemPickupUpdater: ItemPickupUpdater,
    private newRelic: NewRelic
  ) {}

  public async pickupFromContainer(
    itemPickupData: IItemPickup,
    itemToBePicked: IItem,
    character: ICharacter
  ): Promise<boolean> {
    return await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "ItemPickupFromContainer.pickupFromContainer",
      async () => {
        const fromContainer = (await ItemContainer.findById(
          itemPickupData.fromContainerId
        )) as unknown as IItemContainer;

        if (!fromContainer) {
          this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, the origin container was not found.");
          return false;
        }

        const removeFromOriginContainer = await this.removeFromOriginContainer(
          character,
          fromContainer,
          itemToBePicked
        );

        if (!removeFromOriginContainer) {
          this.socketMessaging.sendErrorMessageToCharacter(
            character,
            "Sorry, failed to remove the item from the origin container."
          );
          return false;
        }

        await this.itemPickupUpdater.sendContainerRead(fromContainer, character);

        return true;
      }
    );
  }

  private async removeFromOriginContainer(
    character: ICharacter,
    fromContainer: IItemContainer,
    itemToBeRemoved: IItem
  ): Promise<boolean> {
    // @ts-ignore
    const wasRemoved = await this.characterItemSlots.deleteItemOnSlot(fromContainer, itemToBeRemoved._id);

    if (!wasRemoved) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, failed to remove the item from the origin container."
      );
      return false;
    }

    await this.checkIfBodyIsEmptyAndRemoveLootableFlag(fromContainer);

    return true;
  }

  private async checkIfBodyIsEmptyAndRemoveLootableFlag(fromContainer: IItemContainer): Promise<boolean> {
    let isContainerEmpty = true;
    for (const slot of Object.keys(fromContainer.slots)) {
      if (fromContainer.slots[slot]) {
        isContainerEmpty = false;
        break;
      }
    }

    if (isContainerEmpty) {
      await Item.updateOne({ _id: fromContainer.parentItem }, { isDeadBodyLootable: false });
    }

    return true;
  }
}
