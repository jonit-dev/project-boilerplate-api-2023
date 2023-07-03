import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer as IItemContainerModel, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { ItemDrop } from "@providers/item/ItemDrop";
import { ItemOwnership } from "@providers/item/ItemOwnership";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IDepotContainerWithdraw, IEquipmentAndInventoryUpdatePayload, IItemContainer } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { DepotSystem } from "./DepotSystem";
import { OpenDepot } from "./OpenDepot";

@provide(WithdrawItem)
export class WithdrawItem {
  constructor(
    private openDepot: OpenDepot,
    private depotSystem: DepotSystem,
    private movementHelper: MovementHelper,
    private itemDrop: ItemDrop,
    private characterItemSlots: CharacterItemSlots,
    private socketMessaging: SocketMessaging,
    private characterWeight: CharacterWeight,
    private itemOwnership: ItemOwnership
  ) {}

  @TrackNewRelicTransaction()
  public async withdraw(character: ICharacter, data: IDepotContainerWithdraw): Promise<IItemContainer | undefined> {
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

    const isWithdrawValid = await this.isWithdrawValid(character, data);

    if (!isWithdrawValid) {
      return;
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

    await this.characterWeight.updateCharacterWeight(character);

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      inventory: toContainer as any,
    };
    this.depotSystem.updateInventoryCharacter(payloadUpdate, character);

    // make sure our character ownership is updated
    if (!item.owner) {
      await this.itemOwnership.addItemOwnership(item, character);
    }

    return itemContainer;
  }

  private async isWithdrawValid(character: ICharacter, data: IDepotContainerWithdraw): Promise<boolean> {
    const { itemId, toContainerId } = data;

    const destinationContainer = await ItemContainer.findById(toContainerId);

    if (!destinationContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Destination container not found");
      return false;
    }

    const itemToBeAdded = (await Item.findById(itemId).lean()) as IItem;

    const hasAvailableSlot = await this.characterItemSlots.hasAvailableSlot(
      destinationContainer._id as string,
      itemToBeAdded
    );

    if (!hasAvailableSlot) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, destination container is full.");
      return false;
    }

    return true;
  }
}
