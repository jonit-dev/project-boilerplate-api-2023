import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { MathHelper } from "@providers/math/MathHelper";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
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
    private inMemoryHashTable: InMemoryHashTable,
    private newRelic: NewRelic
  ) {}

  public async addToCharacterView(
    character: ICharacter,
    viewElement: IViewElement,
    type: CharacterViewType
  ): Promise<void> {
    if (!character._id) return;

    if (await this.isOnCharacterView(character, viewElement.id, type)) {
      return;
    }

    await this.inMemoryHashTable.set(`character-view-${type}:${character._id}`, viewElement.id, viewElement);
  }

  public async isOnCharacterView(character: ICharacter, elementId: string, type: CharacterViewType): Promise<boolean> {
    return await this.inMemoryHashTable.has(`character-view-${type}:${character._id}`, elementId);
  }

  public isOutOfCharacterView(character: ICharacter, x: number, y: number): boolean {
    const viewWidth = SOCKET_TRANSMISSION_ZONE_WIDTH * 2;
    const viewHeight = SOCKET_TRANSMISSION_ZONE_WIDTH * 2;

    if (
      x < character.x - viewWidth / 2 ||
      x > character.x + viewWidth / 2 ||
      y < character.y - viewHeight / 2 ||
      y > character.y + viewHeight / 2
    ) {
      return true;
    }

    return false;
  }

  public async clearAllOutOfViewElements(character: ICharacter): Promise<void> {
    const types: CharacterViewType[] = ["npcs", "items", "characters"];
    for (const type of types) {
      await this.clearOutOfViewElements(character, type);
    }
  }

  public async clearOutOfViewElements(character: ICharacter, type: CharacterViewType): Promise<void> {
    const hasView = await this.inMemoryHashTable.hasAll(`character-view-${type}:${character._id}`);

    if (!hasView) {
      return;
    }

    const elementsOnView = await this.inMemoryHashTable.getAll(`character-view-${type}:${character._id}`);

    if (!elementsOnView) {
      return;
    }

    const elementsIds = Object.keys(elementsOnView);
    const elementsToRemove: string[] = [];

    for (const elementId of elementsIds) {
      const element = elementsOnView[elementId] as unknown as IViewElement;

      if (this.isOutOfCharacterView(character, element.x, element.y)) {
        elementsToRemove.push(elementId);
      }
    }

    for (const elementId of elementsToRemove) {
      await this.removeFromCharacterView(character, elementId, type);
    }
  }

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

  public async getAllElementsOnView(
    character: ICharacter,
    type: CharacterViewType
  ): Promise<Record<string, IViewElement> | undefined> {
    return await this.inMemoryHashTable.getAll<IViewElement>(`character-view-${type}:${character._id}`);
  }

  public async hasElementOnView(character: ICharacter, elementId: string, type: CharacterViewType): Promise<boolean> {
    const result = await this.inMemoryHashTable.has(`character-view-${type}:${character._id}`, elementId);

    return result;
  }

  public async clearCharacterView(character: ICharacter): Promise<void> {
    const types: CharacterViewType[] = ["npcs", "items", "characters"];
    for (const type of types) {
      await this.inMemoryHashTable.deleteAll(`character-view-${type}:${character._id}`);
    }
  }

  public async removeFromCharacterView(
    character: ICharacter,
    elementId: string,
    type: CharacterViewType
  ): Promise<void> {
    await this.inMemoryHashTable.delete(`character-view-${type}:${character._id}`, elementId);
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

    const minDistanceChar = (await Character.findById(minDistanceCharacterInfo?.id).lean({
      virtuals: true,
      defaults: true,
    })) as ICharacter;

    return minDistanceChar;
  }

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

  private async getOtherElementsInView<T>(
    Element: Model<any>,
    x: number,
    y: number,
    scene: string,
    filter?: Record<string, any>
  ): Promise<T[]> {
    return await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "CharacterView/getOtherElementsInView",
      async () => {
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
    );
  }
}
