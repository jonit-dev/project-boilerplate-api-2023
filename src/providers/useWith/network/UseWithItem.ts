import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IUseWithItem, UseWithSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { UseWithHelper } from "./UseWithHelper";

interface IValidItemsResponse {
  originItem: IItem;
  targetItem: IItem;
}

@provide(UseWithItem)
export class UseWithItem {
  constructor(
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging,
    private useWithHelper: UseWithHelper
  ) {}

  public onUseWithItem(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, UseWithSocketEvents.UseWithItem, async (data: IUseWithItem, character) => {
      try {
        // Check if character is alive and not banned
        await this.validateData(character, data);
      } catch (error) {
        console.error(error);
      }
    });
  }

  /**
   * Validates the input data and returns the originItem sent on the request
   * @param character
   * @param data
   * @returns originItem is the item that can be used with the tile
   */
  private async validateData(character: ICharacter, data: IUseWithItem): Promise<IValidItemsResponse> {
    // Check if character is alive and not banned
    this.useWithHelper.basicValidations(character, data);

    if (!data.targetItemId) {
      throw new Error(`UseWithTile > Field 'targetItemId' is missing! data: ${JSON.stringify(data)}`);
    }

    // Check if character has the originItemId and originItemId on the equipment or inventory
    const equipment = await Equipment.findById(character.equipment).populate("inventory").exec();
    if (!equipment) {
      throw new Error(`Equipment not found for character with id ${character.id}`);
    }
    const backpack = equipment.inventory as unknown as IItem;
    const backpackContainer = await ItemContainer.findById(backpack.itemContainer);
    if (!backpackContainer) {
      throw new Error(
        `Inventory ItemContainer not found for character with id ${
          character.id
        } and inventory with id ${backpack._id.toString()}`
      );
    }

    // Check if the character has the origin and target items
    const originItem = await this.useWithHelper.getItem(equipment, backpackContainer, data.originItemId);
    const targetItem = await this.useWithHelper.getItem(equipment, backpackContainer, data.targetItemId);

    if (!targetItem.useWithEffect) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        `Item '${targetItem.baseKey}' cannot be used with anything...`
      );
      throw new Error(`targetItem '${targetItem.baseKey}' does not have a useWithEffect function defined`);
    }

    return { originItem, targetItem };
  }
}
