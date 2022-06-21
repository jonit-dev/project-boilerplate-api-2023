import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { MathHelper } from "@providers/math/MathHelper";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { GRID_HEIGHT, GRID_WIDTH, IViewElement, SOCKET_TRANSMISSION_ZONE_WIDTH } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Model } from "mongoose";

export interface ICharacterDistance {
  id: string;
  distance: number;
  x: number;
  y: number;
}
@provide(CharacterView)
export class CharacterView {
  constructor(private socketTransmissionZone: SocketTransmissionZone, private mathHelper: MathHelper) {}

  public async addToCharacterView(
    character: ICharacter,
    viewElement: IViewElement,
    type: "npcs" | "items" | "characters"
  ): Promise<void> {
    const updatedElementView = Object.assign(character.view[type], {
      [viewElement.id]: viewElement,
    });

    character.view = {
      ...character.view,
      [type]: updatedElementView,
    };
    await Character.updateOne({ _id: character._id }, { view: character.view });
  }

  public async removeFromCharacterView(
    character: ICharacter,
    elementId: string,
    type: "npcs" | "items" | "characters"
  ): Promise<void> {
    const updatedCharView = character.view[type];

    delete updatedCharView[elementId];

    await Character.updateOne(
      { _id: character._id },
      {
        view: {
          ...character.view,
          [type]: updatedCharView,
        },
      }
    );
  }

  public async getCharactersAroundXYPosition(
    x: number,
    y: number,
    scene: string,
    filter: Record<string, any> | null = null,
    isOnline: boolean = true
  ): Promise<ICharacter[]> {
    let charFilter = filter || {};

    if (isOnline) {
      charFilter = {
        ...charFilter,
        isOnline: true,
      };
    }

    return await this.getOtherElementsInView<ICharacter>(Character, x, y, scene, charFilter);
  }

  public async getNearestCharactersFromXYPoint(
    x: number,
    y: number,
    scene: string
  ): Promise<ICharacter | undefined | null> {
    const nearbyCharacters = await this.getCharactersAroundXYPosition(x, y, scene);

    const charactersDistance: ICharacterDistance[] = [];

    for (const nearbyCharacter of nearbyCharacters) {
      if (!nearbyCharacter.isAlive) {
        continue;
      }

      const distance = this.mathHelper.getDistanceBetweenPoints(x, y, nearbyCharacter.x, nearbyCharacter.y);

      charactersDistance.push({
        id: nearbyCharacter.id,
        distance: distance,
        x: nearbyCharacter.x,
        y: nearbyCharacter.y,
      });
    }

    // get the character with minimum distance
    const minDistanceCharacterInfo = _.minBy(charactersDistance, "distance");

    const minDistanceChar = await Character.findById(minDistanceCharacterInfo?.id);

    return minDistanceChar;
  }

  public async getElementsInCharView<T>(
    Element: Model<T>,
    character: ICharacter,
    filter?: Record<string, unknown>
  ): Promise<T[]> {
    return await this.getOtherElementsInView(Element, character.x, character.y, character.scene, filter);
  }

  public async getCharactersInView(character: ICharacter): Promise<ICharacter[]> {
    return await this.getElementsInCharView(Character, character, {
      isOnline: true,
      _id: {
        $ne: character._id,
      },
    });
  }

  private async getOtherElementsInView<T>(
    Element: Model<any>,
    x: number,
    y: number,
    scene: string,
    filter?: Record<string, any>
  ): Promise<T[]> {
    const socketTransmissionZone = this.socketTransmissionZone.calculateSocketTransmissionZone(
      x,
      y,
      GRID_WIDTH,
      GRID_HEIGHT,
      SOCKET_TRANSMISSION_ZONE_WIDTH,
      SOCKET_TRANSMISSION_ZONE_WIDTH
    );

    // @ts-ignore
    const otherCharactersInView = await Element.find({
      $and: [
        {
          x: {
            $gte: socketTransmissionZone.x,
            $lte: socketTransmissionZone.width,
          },
        },
        {
          y: {
            $gte: socketTransmissionZone.y,
            $lte: socketTransmissionZone.height,
          },
        },
        {
          scene,
          ...filter,
        },
      ],
    }).lean({ virtuals: true, defaults: true });

    return otherCharactersInView as unknown as T[];
  }
}
