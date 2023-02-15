import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IEquipItemPayload, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { EquipmentUnequip } from "../EquipmentUnequip";

@provide(EquipmentUnequipNetwork)
export class EquipmentUnequipNetwork {
  constructor(
    private socketAuth: SocketAuth,
    private equipmentUnequip: EquipmentUnequip,
    private characterInventory: CharacterInventory
  ) {}

  public onItemUnequip(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      ItemSocketEvents.Unequip,
      async (data: IEquipItemPayload, character: ICharacter) => {
        const itemId = data.itemId;
        const item = (await Item.findById(itemId)) as unknown as IItem;

        const inventory = (await this.characterInventory.getInventory(character)) as unknown as IItem;

        await this.equipmentUnequip.unequip(character, inventory, item);
      }
    );
  }
}
