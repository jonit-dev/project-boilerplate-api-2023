import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Depot } from "@entities/ModuleDepot/DepotModel";
import { IItemContainer as IItemContainerModel } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { CharacterWeight } from "@providers/character/weight/CharacterWeight";
import { ItemOwnership } from "@providers/item/ItemOwnership";
import { ItemUpdater } from "@providers/item/ItemUpdater";
import { ItemView } from "@providers/item/ItemView";
import { MapHelper } from "@providers/map/MapHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IDepotDepositItem, IEquipmentAndInventoryUpdatePayload, IItemContainer } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { DepotSystem } from "./DepotSystem";
import { OpenDepot } from "./OpenDepot";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";

@provide(DepositItem)
export class DepositItem {
  constructor(
    private openDepot: OpenDepot,
    private itemView: ItemView,
    private characterWeight: CharacterWeight,
    private depotSystem: DepotSystem,
    private mapHelper: MapHelper,
    private socketMessaging: SocketMessaging,
    private itemOwnership: ItemOwnership,
    private itemUpdater: ItemUpdater,
    private characterItemSlots: CharacterItemSlots,
    private inMemoryHashTable: InMemoryHashTable,
  ) {}

  @TrackNewRelicTransaction()
  public async deposit(character: ICharacter, data: IDepotDepositItem): Promise<IItemContainer | undefined> {
    const { itemId, npcId, fromContainerId } = data;
    const itemContainer = await this.openDepot.getContainer(character.id, npcId);

    if (!itemContainer) {
      throw new Error(`DepotSystem > Item container not found for character id ${character.id} and npc id ${npcId}`);
    }

    // check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      // prevent depot slot from getting stuck
      await this.characterItemSlots.deleteItemOnSlot(itemContainer as any, itemId);

      throw new Error(`DepotSystem > Item not found: ${itemId}`);
    }

    const npc = (await NPC.findById(npcId).lean()) as INPC;

    const isDepositValid = await this.isDepositValid(character, data, npc);

    if (!isDepositValid) {
      return;
    }

    const isItemFromMap =
      this.mapHelper.isCoordinateValid(item.x) && this.mapHelper.isCoordinateValid(item.y) && item.scene;

    // support depositing items from a tiled map seed
    item.key = item.baseKey;
    await item.save();

    // deposit from the characters container
    if (!!fromContainerId && !isItemFromMap) {
      const container = await this.depotSystem.removeFromContainer(fromContainerId, item);
      await this.inMemoryHashTable.delete("container-all-items", fromContainerId);

      if (!item.owner) {
        await this.itemOwnership.addItemOwnership(item, character);
      }

      await this.markItemAsInDepot(item);

      // whenever a new item is removed, we need to update the character weight
      void this.characterWeight.updateCharacterWeight(character);

      const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
        inventory: container as any,
      };

      this.depotSystem.updateInventoryCharacter(payloadUpdate, character);
    }

    if (isItemFromMap) {
      await this.removeFromMapContainer(item);
    }

    await this.depotSystem.addItemToContainer(character, item, itemContainer as unknown as IItemContainerModel);

    return itemContainer;
  }

  private async markItemAsInDepot(item: IItem): Promise<void> {
    await this.itemUpdater.updateItemRecursivelyIfNeeded(item, {
      $set: {
        isInDepot: true,
      },
    });
  }

  private async isDepositValid(character: ICharacter, data: IDepotDepositItem, npc: INPC): Promise<boolean> {
    // check if there're slots available on the depot

    const depot = await Depot.findOne({ owner: character._id }).lean();

    if (!depot) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, this depot is not available.");
      return false;
    }

    const itemToBeAdded = await Item.findById(data.itemId).lean();

    const hasAvailableSlot = await this.characterItemSlots.hasAvailableSlot(
      depot?.itemContainer as string,
      itemToBeAdded as IItem
    );

    if (!hasAvailableSlot) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, your depot is full. Remove some items and try again."
      );
      return false;
    }

    return true;
  }

  private async removeFromMapContainer(item: IItem): Promise<void> {
    // If an item has a x, y and scene, it means its coming from a map pickup. So we should destroy its representation and warn other characters nearby.
    const itemRemovedFromMap = await this.itemView.removeItemFromMap(item);
    if (!itemRemovedFromMap) {
      throw new Error(`DepotSystem > Error removing item with id ${item.id} from map`);
    }
  }
}
