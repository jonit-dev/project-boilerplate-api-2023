import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { IUseWithItem, IUseWithTile } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(UseWithHelper)
export class UseWithHelper {
  constructor() {}

  public basicValidations(character: ICharacter, data: IUseWithItem | IUseWithTile): void {
    if (!character.isAlive) {
      throw new Error(`UseWith > Character is dead! Character id: ${character.id}`);
    }

    if (character.isBanned) {
      throw new Error(`UseWith > Character is banned! Character id: ${character.id}`);
    }

    if (!character.isOnline) {
      throw new Error(`UseWith > Character is offline! Character id: ${character.id}`);
    }

    if (!data.originItemId) {
      throw new Error(`UseWith > Field 'originItemId' is missing! data: ${JSON.stringify(data)}`);
    }
  }

  public async getItem(equipment: IEquipment, itemContainer: IItemContainer, itemId: string): Promise<IItem> {
    let itemFound = false;
    if (equipment.rightHand?.toString() === itemId) {
      itemFound = true;
    } else if (equipment.leftHand?.toString() === itemId) {
      itemFound = true;
    }
    if (!itemFound) {
      itemFound = itemContainer.itemIds.includes(itemId);
    }

    if (!itemFound) {
      throw new Error("Character does not own the item that wants to use");
    }

    // Check if the item corresponds to the useWithKey
    const item = await Item.findById(itemId);
    if (!item) {
      throw new Error(`Item with id ${itemId} does not exist!`);
    }
    return item;
  }
}
