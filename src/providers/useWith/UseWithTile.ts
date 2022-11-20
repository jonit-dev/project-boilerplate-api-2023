import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { TILE_MAX_REACH_DISTANCE_IN_GRID } from "@providers/constants/TileConstants";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { IItemUseWithEntity, IValidUseWithResponse } from "@providers/item/data/types/itemsBlueprintTypes";
import { MapTiles } from "@providers/map/MapTiles";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IUseWithTile, ToGridX, ToGridY, UseWithSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { UseWithHelper } from "./libs/UseWithHelper";

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
    this.socketAuth.authCharacterOn(
      channel,
      UseWithSocketEvents.UseWithTile,
      async (useWithTileData: IUseWithTile, character) => {
        try {
          const useWithData = await this.validateData(character, useWithTileData);

          if (useWithData) {
            const { originItem, useWithTileEffect } = useWithData;
            await useWithTileEffect!(originItem, useWithTileData.targetTile, character);
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }

  /**
   * Validates the input data and returns the IValidUseWithResponse based on the item and tile passed on data field
   * @param character
   * @param data
   * @returns IValidUseWithResponse with the item that can be used with the tile and the useWithEffect function defined for it
   */
  private async validateData(character: ICharacter, data: IUseWithTile): Promise<IValidUseWithResponse | undefined> {
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
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, the selected tile is out of reach.");
      return;
    }
    // check if tile exists
    const tileId = await this.mapTiles.getTileId(
      data.targetTile.map,
      ToGridX(data.targetTile.x),
      ToGridY(data.targetTile.y),
      data.targetTile.layer
    );

    if (!tileId) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, the selected tile doesn't exist.");
      return;
    }

    // Check if tile has useWithKey defined
    const useWithKey = this.mapTiles.getUseWithKey(
      data.targetTile.map,
      ToGridX(data.targetTile.x),
      ToGridY(data.targetTile.y),
      data.targetTile.layer
    );
    if (!useWithKey) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, this tile cannot be used with the item provided"
      );
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

    const itemBlueprint = itemsBlueprintIndex[originItem.baseKey] as Partial<IItemUseWithEntity>;

    const useWithTileEffect = itemBlueprint.useWithTileEffect;

    if (!useWithTileEffect) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        `Item '${originItem.baseKey}' cannot be used with tiles...`
      );
      throw new Error(
        `UseWithTile > originItem '${originItem.baseKey}' does not have a useWithTileEffect function defined`
      );
    }

    return { originItem, useWithTileEffect };
  }
}
