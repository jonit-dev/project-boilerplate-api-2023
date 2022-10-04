import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item, IItem } from "@entities/ModuleInventory/ItemModel";
import { TILE_MAX_REACH_DISTANCE_IN_GRID } from "@providers/constants/TileConstants";
import { MapTiles } from "@providers/map/MapTiles";
import { MathHelper } from "@providers/math/MathHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { GRID_WIDTH, IUseWithTile, UseWithSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(UseWithTile)
export class UseWithTile {
  constructor(
    private socketAuth: SocketAuth,
    private mathHelper: MathHelper,
    private socketMessaging: SocketMessaging,
    private mapTiles: MapTiles
  ) {}

  public onUseWithTile(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, UseWithSocketEvents.UseWithTile, async (data: IUseWithTile, character) => {
      try {
        const selectedItem = await this.validateData(character, data);
        if (selectedItem) {
          // TODO: call the useEffect
        }
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
  private async validateData(character: ICharacter, data: IUseWithTile): Promise<IItem | undefined> {
    // Check if character is alive and not banned
    if (!character.isAlive) {
      throw new Error(`UseWithTile > Character is dead! Character id: ${character.id}`);
    }

    if (character.isBanned) {
      throw new Error(`UseWithTile > Character is banned! Character id: ${character.id}`);
    }

    if (!character.isOnline) {
      throw new Error(`UseWithTile > Character is offline! Character id: ${character.id}`);
    }

    if (!data.targetTile) {
      throw new Error(`UseWithTile > Field 'targetTile' is missing! data: ${JSON.stringify(data)}`);
    }

    // Check if tile position is at character's reach
    const distanceToTile = this.mathHelper.getDistanceBetweenPoints(
      data.targetTile.x,
      data.targetTile.y,
      character.x,
      character.y
    );

    const isUnderRange = distanceToTile <= TILE_MAX_REACH_DISTANCE_IN_GRID * GRID_WIDTH;
    if (!isUnderRange) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Tile out of reach...");
      return;
    }

    // Check if tile has useWithKey defined
    const useWithKey = this.mapTiles.getUseWithKey(
      data.targetTile.map,
      data.targetTile.x,
      data.targetTile.y,
      data.targetTile.layer
    );
    if (!useWithKey) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "This tile cannot be used with anything...");
      return;
    }

    // Check if character has the originItemId on the equipment or inventory
    const equipment = await Equipment.findById(character.equipment).populate("inventory").exec();
    if (!equipment) {
      throw new Error(`Equipment not found for character with id ${character.id}`);
    }
    let foundItem = false;
    if (equipment.rightHand?.toString() === data.originItemId) {
      foundItem = true;
    } else if (equipment.leftHand?.toString() === data.originItemId) {
      foundItem = true;
    }
    if (!foundItem) {
      const backpack = equipment.inventory as unknown as IItem;
      const backpackContainer = await ItemContainer.findById(backpack.itemContainer);
      if (!backpackContainer) {
        throw new Error(
          `Inventory ItemContainer not found for character with id ${
            character.id
          } and inventory with id ${backpack._id.toString()}`
        );
      }
      foundItem = backpackContainer.itemIds.includes(data.originItemId);
    }

    if (!foundItem) {
      throw new Error("Character does not own the item that wants to use");
    }

    // Check if the item corresponds to the useWithKey
    const originItem = await Item.findById(data.originItemId);
    if (!originItem) {
      throw new Error(`Item with id ${data.originItemId} does not exist!`);
    }

    if (originItem.baseKey !== useWithKey) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        `Invalid item to use with tile. It should be a '${useWithKey}', but the selected item is a '${originItem.baseKey}'!`
      );
      return;
    }

    return originItem;
  }
}
