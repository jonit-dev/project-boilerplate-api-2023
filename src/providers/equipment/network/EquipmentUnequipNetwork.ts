import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
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
      ItemSocketEvents.Unequip,
      async (data: IEquipItemPayload, character: ICharacter) => {
        const itemId = data.itemId;
        const item = (await Item.findById(itemId)) as unknown as IItem;

        const inventory = (await character.inventory) as unknown as IItem;

        await this.equipmentUnequip.unequip(character, inventory, itemId, item);
      }
    );
  }
}
