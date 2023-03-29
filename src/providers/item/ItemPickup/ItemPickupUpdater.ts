import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterWeight } from "@providers/character/CharacterWeight";
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
import { ItemOwnership } from "../ItemOwnership";

@provide(ItemPickupUpdater)
export class ItemPickupUpdater {
  constructor(
    private itemOwnership: ItemOwnership,
    private characterWeight: CharacterWeight,
    private equipmentSlots: EquipmentSlots,
    private socketMessaging: SocketMessaging,
    private itemContainerHelper: ItemContainerHelper
  ) {}

  public async finalizePickup(itemToBePicked: IItem, character: ICharacter): Promise<void> {
    await this.itemOwnership.addItemOwnership(itemToBePicked, character);

    // whenever a new item is added, we need to update the character weight
    await this.characterWeight.updateCharacterWeight(character);

    await Item.updateOne({ _id: itemToBePicked._id }, { isBeingPickedUp: false }); // unlock item
  }

  public async refreshEquipmentIfInventoryItem(character: ICharacter): Promise<void> {
    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character.equipment as unknown as string);

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
