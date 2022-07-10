import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IEquipItemPayload, IItem, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { EquipmentUnequip } from "../EquipmentUnequip";

@provide(EquipmentUnequipNetwork)
export class EquipmentUnequipNetwork {
  constructor(private socketAuth: SocketAuth, private equipmentUnequip: EquipmentUnequip) {}

  public onItemUnequip(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      ItemSocketEvents.Equip,
      async (data: IEquipItemPayload, character: ICharacter) => {
        const itemId = data.itemId;
        const targetSlot = data.targetSlot;
        const item = (await Item.findById(itemId)) as unknown as IItem;

        const inventory = (await character.inventory) as unknown as IItem;

        const itemContainer = (await ItemContainer.findOne({
          owner: character.id,
        })) as unknown as IItemContainer;

        await this.equipmentUnequip.unequip(character, inventory, item, itemContainer, targetSlot);
      }
    );
  }
}
