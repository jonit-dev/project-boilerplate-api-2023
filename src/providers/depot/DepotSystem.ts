import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer as IItemContainerModel, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { CharacterItemStack } from "@providers/character/characterItems/CharacterItemStack";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentAndInventoryUpdatePayload, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(DepotSystem)
export class DepotSystem {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItemSlots: CharacterItemSlots,
    private characterItemStack: CharacterItemStack
  ) {}

  /**
   * npcBasicValidation validates if the NPC exists and has depot
   * If validation passes, returns the corresponding NPC
   * @param npcId
   * @returns NPC entity if validation pass
   */
  public async npcBasicValidation(npcId: string): Promise<INPC> {
    const npc = await NPC.findOne({
      _id: npcId,
    });

    if (!npc) {
      throw new Error(`DepotSystem > NPC not found: ${npcId}`);
    }

    if (!npc.hasDepot) {
      throw new Error(`DepotSystem > NPC does not support depot ('hasDepot' = false): NPC id ${npcId}`);
    }
    return npc;
  }

  public async removeFromContainer(containerId: string, item: IItem): Promise<IItemContainerModel> {
    const fromContainer = (await ItemContainer.findById(containerId).cacheQuery({
      cacheKey: `${containerId}-targetContainer`,
    })) as unknown as IItemContainerModel;

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

  public async addItemToContainer(
    character: ICharacter,
    item: IItem,
    container: IItemContainerModel
  ): Promise<boolean> {
    // if stackable
    if (item.maxStackSize > 1) {
      const wasStacked = await this.characterItemStack.tryAddingItemToStack(character, container, item);

      if (wasStacked) {
        return true;
      }
    }
    return this.characterItemSlots.tryAddingItemOnFirstSlot(character, item, container, false);
  }

  public updateInventoryCharacter(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }
}
