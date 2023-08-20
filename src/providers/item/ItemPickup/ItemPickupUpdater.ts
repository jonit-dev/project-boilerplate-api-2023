import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterWeight } from "@providers/character/weight/CharacterWeight";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { ItemContainerHelper } from "@providers/itemContainer/ItemContainerHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IEquipmentAndInventoryUpdatePayload,
  IItemContainer,
  IItemContainerRead,
  ItemSocketEvents,
  ItemType,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { clearCacheForKey } from "speedgoose";

@provide(ItemPickupUpdater)
export class ItemPickupUpdater {
  constructor(
    private characterWeight: CharacterWeight,
    private equipmentSlots: EquipmentSlots,
    private socketMessaging: SocketMessaging,
    private itemContainerHelper: ItemContainerHelper,
    private inMemoryHashTable: InMemoryHashTable
  ) {}

  @TrackNewRelicTransaction()
  public async finalizePickup(itemToBePicked: IItem, character: ICharacter): Promise<void> {
    await clearCacheForKey(`${character._id}-inventory`);

    await this.inMemoryHashTable.delete("inventory-weight", character._id);
    await this.inMemoryHashTable.delete("character-max-weights", character._id);
    await this.inMemoryHashTable.deleteAll(`load-craftable-items-sugested:${character._id}`);

    // whenever a new item is added, we need to update the character weight
    await this.characterWeight.updateCharacterWeight(character);
  }

  public async refreshEquipmentIfInventoryItem(character: ICharacter): Promise<void> {
    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(
      character._id,
      character.equipment as unknown as string
    );

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      equipment: equipmentSlots,
    };

    this.updateInventoryCharacter(payloadUpdate, character);
  }

  public updateInventoryCharacter(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }

  public async sendContainerRead(itemContainer: IItemContainer, character: ICharacter): Promise<void> {
    if (character && itemContainer) {
      const type = await this.itemContainerHelper.getContainerType(itemContainer);

      if (!type) {
        this.socketMessaging.sendErrorMessageToCharacter(character);
        return;
      }

      this.socketMessaging.sendEventToUser<IItemContainerRead>(character.channelId!, ItemSocketEvents.ContainerRead, {
        // @ts-ignore
        itemContainer,
        type,
      });
    }
  }

  public getAllowedItemTypes(): ItemType[] {
    const allowedItemTypes: ItemType[] = [];

    for (const allowedItemType of Object.keys(ItemType)) {
      allowedItemTypes.push(ItemType[allowedItemType]);
    }

    return allowedItemTypes;
  }
}
