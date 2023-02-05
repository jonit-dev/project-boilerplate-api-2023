import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { TILE_MAX_REACH_DISTANCE_IN_GRID } from "@providers/constants/TileConstants";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { MapTiles } from "@providers/map/MapTiles";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IItemUseWith, IUseWithTileValidationResponse } from "@providers/useWith/useWithTypes";
import { IUseWithTile, MAP_LAYERS_TO_ID, ToGridX, ToGridY, UseWithSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { UseWithHelper } from "./libs/UseWithHelper";

@provide(UseWithTile)
export class UseWithTile {
  constructor(
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging,
    private mapTiles: MapTiles,
    private useWithHelper: UseWithHelper,
    private movementHelper: MovementHelper,
    private skillIncrease: SkillIncrease
  ) {}

  public onUseWithTile(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      UseWithSocketEvents.UseWithTile,
      async (useWithTileData: IUseWithTile, character) => {
        try {
          const useWithData = await this.validateData(character, useWithTileData);

          if (useWithData) {
            const { originItem, useWithTileEffect, targetName } = useWithData;
            await useWithTileEffect!(originItem, useWithTileData.targetTile, targetName, character, this.skillIncrease);
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
  private async validateData(
    character: ICharacter,
    data: IUseWithTile
  ): Promise<IUseWithTileValidationResponse | undefined> {
    // Check if character is alive and not banned
    this.useWithHelper.basicValidations(character, data);

    // Check if the character has the originItem
    const originItem = await this.useWithHelper.getItem(character, data.originItemId);

    const itemBlueprint = itemsBlueprintIndex[originItem.baseKey] as Partial<IItemUseWith>;

    // Check if tile position is at character's reach
    const isUnderRange = this.movementHelper.isUnderRange(
      character.x,
      character.y,
      data.targetTile.x,
      data.targetTile.y,
      itemBlueprint.useWithMaxDistanceGrid || TILE_MAX_REACH_DISTANCE_IN_GRID
    );
    if (!isUnderRange) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, the selected tile is out of reach.");
      return;
    }
    // check if tile exists
    const tileId = this.mapTiles.getTileId(
      data.targetTile.map,
      ToGridX(data.targetTile.x),
      ToGridY(data.targetTile.y),
      MAP_LAYERS_TO_ID[data.targetTile.layer]
    );

    if (!tileId) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, the selected tile doesn't exist.");
      return;
    }

    // Check if tile has useWithKey defined
    const useWithKey = this.mapTiles.getPropertyFromLayer(
      data.targetTile.map,
      ToGridX(data.targetTile.x),
      ToGridY(data.targetTile.y),
      MAP_LAYERS_TO_ID[data.targetTile.layer],
      "usewith_origin_item_key"
    );
    if (!useWithKey) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, this tile cannot be used with the item provided"
      );
      return;
    }

    const useWithTargetName = this.mapTiles.getPropertyFromLayer(
      data.targetTile.map,
      ToGridX(data.targetTile.x),
      ToGridY(data.targetTile.y),
      MAP_LAYERS_TO_ID[data.targetTile.layer],
      "usewith_target_item_key"
    );

    if (originItem.baseKey !== useWithKey) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        `Invalid item to use with tile. It should be a '${useWithKey}', but the selected item is a '${originItem.baseKey}'!`
      );
      return;
    }

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

    return { originItem, useWithTileEffect, targetName: useWithTargetName };
  }
}
