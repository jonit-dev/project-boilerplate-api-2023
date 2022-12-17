import { ItemContainer, IItemContainer as IItemContainerModel } from "@entities/ModuleInventory/ItemContainerModel";
import { provide } from "inversify-binding-decorators";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { OpenDepot } from "./OpenDepot";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { ItemView } from "@providers/item/ItemView";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentAndInventoryUpdatePayload, ItemSocketEvents, IItemContainer } from "@rpg-engine/shared";
import { CharacterItemStack } from "@providers/character/characterItems/CharacterItemStack";
import { IDepotDepositItem } from "./network/DepotNetworkDeposit";

@provide(DepositItem)
export class DepositItem {
  constructor(
    private openDepot: OpenDepot,
    private characterItemSlots: CharacterItemSlots,
    private characterItemStack: CharacterItemStack,
    private itemView: ItemView,
    private characterWeight: CharacterWeight,
    private socketMessaging: SocketMessaging
  ) {}

  public async deposit(character: ICharacter, data: IDepotDepositItem): Promise<IItemContainer> {
    const { itemId, npcId, fromContainerId } = data;
    const itemContainer = await this.openDepot.getContainer(character.id, npcId);

    // check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      throw new Error(`DepotSystem > Item not found: ${itemId}`);
    }

    const isDepositFromMapContainer = item.x !== undefined && item.y !== undefined && item.scene !== undefined;

    // support depositing items from a tiled map seed
    item.key = item.baseKey;
    await item.save();

    // deposit from the characters container
    if (!!fromContainerId && !isDepositFromMapContainer) {
      const container = await this.removeFromContainer(fromContainerId, item);
      // whenever a new item is removed, we need to update the character weight
      await this.characterWeight.updateCharacterWeight(character);

      const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
        inventory: container as any,
      };

      this.updateInventoryCharacter(payloadUpdate, character);
    }

    if (isDepositFromMapContainer) {
      await this.removeFromMapContainer(item);
    }

    await this.addItemToContainer(character, item, itemContainer as unknown as IItemContainerModel);

    return itemContainer;
  }

  private async removeFromContainer(containerId: string, item: IItem): Promise<IItemContainerModel> {
    const fromContainer = (await ItemContainer.findById(containerId)) as unknown as IItemContainerModel;

    if (!fromContainer) {
      throw new Error(`DepotSystem > ItemContainer not found: ${containerId}`);
    }

    // remove item from origin container
    const wasRemoved = await this.characterItemSlots.deleteItemOnSlot(fromContainer, item._id);

    if (!wasRemoved) {
      throw new Error(`DepotSystem > Error removing item with id ${item.id} from container: ${containerId}`);
    }
    return fromContainer;
  }

  private async removeFromMapContainer(item: IItem): Promise<void> {
    // If an item has a x, y and scene, it means its coming from a map pickup. So we should destroy its representation and warn other characters nearby.
    const itemRemovedFromMap = await this.itemView.removeItemFromMap(item);
    if (!itemRemovedFromMap) {
      throw new Error(`DepotSystem > Error removing item with id ${item.id} from map`);
    }
  }

  private async addItemToContainer(character: ICharacter, item: IItem, container: IItemContainerModel): Promise<void> {
    // if stackable
    if (item.maxStackSize > 1) {
      const wasStacked = await this.characterItemStack.tryAddingItemToStack(character, container, item);

      if (wasStacked) {
        return;
      }
    }
    await this.characterItemSlots.tryAddingItemOnFirstSlot(character, item, container, false);
  }

  private updateInventoryCharacter(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }
}
