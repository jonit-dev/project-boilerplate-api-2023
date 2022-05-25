import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { GRID_HEIGHT, GRID_WIDTH, IViewElement, SOCKET_TRANSMISSION_ZONE_WIDTH } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Model } from "mongoose";

@provide(CharacterView)
export class CharacterView {
  constructor(private socketTransmissionZone: SocketTransmissionZone) {}

  public async addToCharacterView(
    character: ICharacter,
    viewElement: IViewElement,
    type: "npcs" | "items" | "characters"
  ): Promise<void> {
    console.log("adding to character view...");
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
    const updatedCharView = _.omit(character.view[type], elementId);

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
    });
    return otherCharactersInView as unknown as T[];
  }
}
