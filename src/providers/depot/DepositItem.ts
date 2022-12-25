import { IItemContainer as IItemContainerModel } from "@entities/ModuleInventory/ItemContainerModel";
import { provide } from "inversify-binding-decorators";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { OpenDepot } from "./OpenDepot";
import { ItemView } from "@providers/item/ItemView";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IEquipmentAndInventoryUpdatePayload, IItemContainer, IDepotDepositItem } from "@rpg-engine/shared";
import { DepotSystem } from "./DepotSystem";

@provide(DepositItem)
export class DepositItem {
  constructor(
    private openDepot: OpenDepot,
    private itemView: ItemView,
    private characterWeight: CharacterWeight,
    private depotSystem: DepotSystem
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

    const isDepositFromMapContainer = item.x !== undefined && item.y !== undefined && item.scene !== undefined;

    // support depositing items from a tiled map seed
    item.key = item.baseKey;
    await item.save();

    // deposit from the characters container
    if (!!fromContainerId && !isDepositFromMapContainer) {
      const container = await this.depotSystem.removeFromContainer(fromContainerId, item);
      // whenever a new item is removed, we need to update the character weight
      await this.characterWeight.updateCharacterWeight(character);

      const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
        inventory: container as any,
      };

      this.depotSystem.updateInventoryCharacter(payloadUpdate, character);
    }

    if (isDepositFromMapContainer) {
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
