import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer as IItemContainerModel } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { ItemView } from "@providers/item/ItemView";
import { MapHelper } from "@providers/map/MapHelper";
import { IDepotDepositItem, IEquipmentAndInventoryUpdatePayload, IItemContainer } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { DepotSystem } from "./DepotSystem";
import { OpenDepot } from "./OpenDepot";

@provide(DepositItem)
export class DepositItem {
  constructor(
    private openDepot: OpenDepot,
    private itemView: ItemView,
    private characterWeight: CharacterWeight,
    private depotSystem: DepotSystem,
    private mapHelper: MapHelper
  ) {}

  public async deposit(character: ICharacter, data: IDepotDepositItem): Promise<IItemContainer> {
    const { itemId, npcId, fromContainerId } = data;
    const itemContainer = await this.openDepot.getContainer(character.id, npcId);
    if (!itemContainer) {
      throw new Error(`DepotSystem > Item container not found for character id ${character.id} and npc id ${npcId}`);
    }

    // check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      throw new Error(`DepotSystem > Item not found: ${itemId}`);
    }

    const isItemFromMap =
      this.mapHelper.isCoordinateValid(item.x) && this.mapHelper.isCoordinateValid(item.y) && item.scene;

    // support depositing items from a tiled map seed
    item.key = item.baseKey;
    await item.save();

    // deposit from the characters container
    if (!!fromContainerId && !isItemFromMap) {
      const container = await this.depotSystem.removeFromContainer(fromContainerId, item);
      // whenever a new item is removed, we need to update the character weight
      await this.characterWeight.updateCharacterWeight(character);

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

  private async removeFromMapContainer(item: IItem): Promise<void> {
    // If an item has a x, y and scene, it means its coming from a map pickup. So we should destroy its representation and warn other characters nearby.
    const itemRemovedFromMap = await this.itemView.removeItemFromMap(item);
    if (!itemRemovedFromMap) {
      throw new Error(`DepotSystem > Error removing item with id ${item.id} from map`);
    }
  }
}
