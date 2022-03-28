import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { GRID_HEIGHT, GRID_WIDTH, SOCKET_TRANSMISSION_ZONE_WIDTH } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Model } from "mongoose";

@provide(CharacterView)
export class CharacterView {
  constructor(private socketTransmissionZone: SocketTransmissionZone) {}

  public async getElementsInCharView<T>(
    Element: Model<T>,
    character: ICharacter,
    filter?: Record<string, unknown>
  ): Promise<T[]> {
    const socketTransmissionZone = this.socketTransmissionZone.calculateSocketTransmissionZone(
      character.x,
      character.y,
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
          scene: character.scene,
          ...filter,
        },
      ],
    });
    return otherCharactersInView as unknown as T[];
  }

  public async getCharactersInView(character: ICharacter): Promise<ICharacter[]> {
    return await this.getElementsInCharView(Character, character, {
      isOnline: true,
      _id: {
        $ne: character._id,
      },
    });
  }
}
