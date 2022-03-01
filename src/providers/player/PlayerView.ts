import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { IOtherPlayer } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(PlayerView)
export class PlayerView {
  public async bidirectionalUpdateCharactersInView(
    originCharacter: ICharacter,
    otherCharacters: ICharacter[]
  ): Promise<void> {
    for (const otherChars of otherCharacters) {
      const otherCharacter = await Character.findById(otherChars);

      if (!otherCharacter) {
        continue;
      }

      //! Update on other character
      const otherCharacterHasOriginCharacter = otherCharacter.otherPlayersInView?.some(
        (p: IOtherPlayer) => p.id === originCharacter._id
      );
      if (!otherCharacterHasOriginCharacter) {
        otherCharacter.otherPlayersInView?.push(originCharacter);
        await otherCharacter.save();
      }
      //! Update on origin player

      const originCharacterHasOtherCharacter = originCharacter.otherPlayersInView?.some(
        (p) => p.id === otherCharacter._id
      );
      if (!originCharacterHasOtherCharacter) {
        originCharacter.otherPlayersInView?.push(otherCharacter);
        await originCharacter.save();
      }
    }
  }

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
