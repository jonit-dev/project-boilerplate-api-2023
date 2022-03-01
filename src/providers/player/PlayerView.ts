import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { provide } from "inversify-binding-decorators";

@provide(PlayerView)
export class PlayerView {
  public async getCharactersInView(character: ICharacter): Promise<ICharacter[]> {
    if (!character.cameraCoordinates) {
      console.log("Error: character has no camera coordinates");
      return [];
    }

    const { cameraCoordinates } = character;

    const otherCharactersInView = await Character.find({
      $and: [
        {
          x: {
            $gte: cameraCoordinates.x,
            $lte: cameraCoordinates.x + cameraCoordinates.width,
          },
        },
        {
          y: {
            $gte: cameraCoordinates.y,
            $lte: cameraCoordinates.y + cameraCoordinates.height,
          },
        },
        {
          isOnline: true,
          _id: {
            $ne: character._id,
          },
          scene: character.scene,
        },
      ],
    });
    return otherCharactersInView as unknown as ICharacter[];
  }
}
