import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { provide } from "inversify-binding-decorators";
import { Model } from "mongoose";

@provide(PlayerView)
export class PlayerView {
  public async getCharactersWithXYPositionInView(x: number, y: number, scene: string): Promise<ICharacter[]> {
    // fetch characters that have a X,Y position under their cameraCoordinates

    //! TODO: Refactor to mongoose query (more performant)
    const characters = await Character.find({
      isOnline: true,
      scene: scene,
    }).lean();

    const output: ICharacter[] = [];

    for (const character of characters) {
      const { cameraCoordinates } = character;

      if (
        x >= cameraCoordinates.x &&
        x <= cameraCoordinates.x + cameraCoordinates.width &&
        y >= cameraCoordinates.y &&
        y <= cameraCoordinates.y + cameraCoordinates.height
      ) {
        output.push(character as ICharacter);
      }
    }

    return output;
  }

  public async getElementsInCharView<T>(Element: Model<T>, character: ICharacter): Promise<T[]> {
    if (!character.cameraCoordinates) {
      console.log("Error: character has no camera coordinates");
      return [];
    }

    const { cameraCoordinates } = character;

    // @ts-ignore
    const otherCharactersInView = await Element.find({
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
          scene: character.scene,
        },
      ],
    });
    return otherCharactersInView as unknown as T[];
  }

  public async getCharactersInView(character: ICharacter): Promise<ICharacter[]> {
    if (!character.cameraCoordinates) {
      console.log("Error: character has no camera coordinates");
      return [];
    }

    return await this.getElementsInCharView(Character, character);
  }
}
