import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer, IItemContainer as IItemContainerModel } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { ItemDrop } from "@providers/item/ItemDrop";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { IItemContainer, IDepotContainerWithdraw, IEquipmentAndInventoryUpdatePayload } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { DepotSystem } from "./DepotSystem";
import { OpenDepot } from "./OpenDepot";

@provide(WithdrawItem)
export class WithdrawItem {
  constructor(
    private openDepot: OpenDepot,
    private depotSystem: DepotSystem,
    private movementHelper: MovementHelper,
    private itemDrop: ItemDrop
  ) {}

  public async withdraw(character: ICharacter, data: IDepotContainerWithdraw): Promise<IItemContainer> {
    const { npcId, itemId, toContainerId } = data;
    let itemContainer = await this.openDepot.getContainer(character.id, npcId);
    if (!itemContainer) {
      throw new Error(`DepotSystem > Item container not found for character id ${character.id} and npc id ${npcId}`);
    }

    // check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      throw new Error(`DepotSystem > Item not found: ${itemId}`);
    }

    // check if item is on depot container
    // and remove it
    itemContainer = (await this.depotSystem.removeFromContainer(
      itemContainer._id.toString(),
      item
    )) as unknown as IItemContainer;

    // check if destination container exists
    const toContainer = (await ItemContainer.findById(toContainerId)) as unknown as IItemContainerModel;

    if (!toContainer) {
      throw new Error(`DepotSystem > Destination ItemContainer not found: ${toContainerId}`);
    }

    // check if destination container has slot available or can be stacked
    const addedToContainer = await this.depotSystem.addItemToContainer(character, item, toContainer);

    // if not, drop item
    if (!addedToContainer) {
      // drop items on the floor
      // 1. get nearby grid points without solids
      const gridPoints = await this.movementHelper.getNearbyGridPoints(character, 1);
      // 2. drop items on those grid points
      await this.itemDrop.dropItems([item], gridPoints, character.scene);
    }

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      inventory: toContainer as any,
    };

    this.depotSystem.updateInventoryCharacter(payloadUpdate, character);

    return itemContainer;
  }
}
