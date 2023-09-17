import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
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

export type CharacterViewType = "npcs" | "items" | "characters";

@provide(CharacterView)
export class CharacterView {
  constructor(
    private socketTransmissionZone: SocketTransmissionZone,
    private mathHelper: MathHelper,
    private inMemoryHashTable: InMemoryHashTable
  ) {}

  @TrackNewRelicTransaction()
  public async addToCharacterView(
    characterId: string,
    viewElement: IViewElement,
    type: CharacterViewType
  ): Promise<void> {
    if (!characterId) return;

    if (await this.isOnCharacterView(characterId, viewElement.id, type)) {
      return;
    }

    await this.inMemoryHashTable.set(`character-view-${type}:${characterId}`, viewElement.id, viewElement);
  }

  public async isOnCharacterView(characterId: string, elementId: string, type: CharacterViewType): Promise<boolean> {
    return await this.inMemoryHashTable.has(`character-view-${type}:${characterId}`, elementId);
  }

  public isOutOfCharacterView(characterX: number, characterY: number, x: number, y: number): boolean {
    const viewWidth = SOCKET_TRANSMISSION_ZONE_WIDTH * 2;
    const viewHeight = SOCKET_TRANSMISSION_ZONE_WIDTH * 2;

    if (
      x < characterX - viewWidth / 2 ||
      x > characterX + viewWidth / 2 ||
      y < characterY - viewHeight / 2 ||
      y > characterY + viewHeight / 2
    ) {
      return true;
    }

    return false;
  }

  @TrackNewRelicTransaction()
  public async clearAllOutOfViewElements(characterId: string, characterX: number, characterY: number): Promise<void> {
    const types: CharacterViewType[] = ["npcs", "items", "characters"];
    const clearPromises = types.map((type) => this.clearOutOfViewElements(characterId, characterX, characterY, type));
    await Promise.all(clearPromises);
  }

  @TrackNewRelicTransaction()
  public async clearOutOfViewElements(
    characterId: string,
    characterX: number,
    characterY: number,
    type: CharacterViewType
  ): Promise<void> {
    const hasView = await this.inMemoryHashTable.hasAll(`character-view-${type}:${characterId}`);
    if (!hasView) {
      return;
    }

    const elementsOnView = await this.inMemoryHashTable.getAll(`character-view-${type}:${characterId}`);
    if (!elementsOnView) {
      return;
    }

    const elementsIds = Object.keys(elementsOnView);
    const elementsToRemove = new Set<string>();

    for (const elementId of elementsIds) {
      const element = elementsOnView[elementId] as unknown as IViewElement;
      if (this.isOutOfCharacterView(characterX, characterY, element.x, element.y)) {
        elementsToRemove.add(elementId);
      }
    }

    // Convert the Set back to an array for Promise.all
    const removePromises = Array.from(elementsToRemove).map((elementId) =>
      this.removeFromCharacterView(characterId, elementId, type)
    );

    await Promise.all(removePromises);
  }

  @TrackNewRelicTransaction()
  public async getElementOnView(
    character: ICharacter,
    elementId: string,
    type: CharacterViewType
  ): Promise<IViewElement | undefined> {
    const query = (await this.inMemoryHashTable.get(
      `character-view-${type}:${character._id}`,
      elementId
    )) as IViewElement;

    if (!query) {
      return;
    }

    return query;
  }

  @TrackNewRelicTransaction()
  public async getAllElementsOnView(
    character: ICharacter,
    type: CharacterViewType
  ): Promise<Record<string, IViewElement> | undefined> {
    return await this.inMemoryHashTable.getAll<IViewElement>(`character-view-${type}:${character._id}`);
  }

  @TrackNewRelicTransaction()
  public async hasElementOnView(character: ICharacter, elementId: string, type: CharacterViewType): Promise<boolean> {
    const result = await this.inMemoryHashTable.has(`character-view-${type}:${character._id}`, elementId);

    return result;
  }

  @TrackNewRelicTransaction()
  public async clearCharacterView(character: ICharacter): Promise<void> {
    const types: CharacterViewType[] = ["npcs", "items", "characters"];
    for (const type of types) {
      await this.inMemoryHashTable.deleteAll(`character-view-${type}:${character._id}`);
    }
  }

  @TrackNewRelicTransaction()
  public async removeFromCharacterView(characterId: string, elementId: string, type: CharacterViewType): Promise<void> {
    await this.inMemoryHashTable.delete(`character-view-${type}:${characterId}`, elementId);
  }

  @TrackNewRelicTransaction()
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

  @TrackNewRelicTransaction()
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

    const minDistanceChar = (await Character.findById(minDistanceCharacterInfo?.id).lean({
      virtuals: true,
      defaults: true,
    })) as ICharacter;

    return minDistanceChar;
  }

  @TrackNewRelicTransaction()
  public async getElementsInCharView<T>(
    // @ts-ignore
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

  @TrackNewRelicTransaction()
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
    }).lean({ virtuals: true, defaults: true }); //! Required until we have quadtrees

    return otherCharactersInView as unknown as T[];
  }
}
