import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";

// this class is just to deal with the edge case of the character equipping an inventory
@provide(EquipmentEquipInventory)
export class EquipmentEquipInventory {
  constructor(private socketMessaging: SocketMessaging) {}

  public async equipInventory(character: ICharacter, item: IItem): Promise<boolean> {
    const equipment = await Equipment.findById(character.equipment);

    if (!equipment) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, equipment not found.");
      return false;
    }

    const isSlotAvailable = equipment.inventory === undefined;

    if (!isSlotAvailable) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, your inventory slot is not empty.");
      return false;
    }

    equipment.inventory = item._id;
    await equipment.save();

    return true;
  }
}
