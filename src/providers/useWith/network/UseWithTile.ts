import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { TILE_MAX_REACH_DISTANCE_IN_GRID } from "@providers/constants/TileConstants";
import { MapTiles } from "@providers/map/MapTiles";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IUseWithTile, UseWithSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { UseWithHelper } from "./UseWithHelper";

@provide(UseWithTile)
export class UseWithTile {
  constructor(
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging,
    private mapTiles: MapTiles,
    private useWithHelper: UseWithHelper,
    private movementHelper: MovementHelper
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
    this.useWithHelper.basicValidations(character, data);

    // Check if tile position is at character's reach
    const isUnderRange = this.movementHelper.isUnderRange(
      character.x,
      character.y,
      data.targetTile.x,
      data.targetTile.y,
      TILE_MAX_REACH_DISTANCE_IN_GRID
    );
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

    // Check if the character has the originItem
    const originItem = await this.useWithHelper.getItem(character, data.originItemId);

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
