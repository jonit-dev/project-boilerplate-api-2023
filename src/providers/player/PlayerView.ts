import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

@provide(PlayerView)
export class PlayerView {
  public async bidirectionalUpdateCharactersInView(
    originCharacter: ICharacter,
    otherCharactersIds: string[]
  ): Promise<void> {
    for (const otherCharIds of otherCharactersIds) {
      const otherCharacter = await Character.findById(otherCharIds);

      if (
        otherCharacter &&
        otherCharacter._id !== originCharacter._id &&
        !otherCharacter.otherPlayersInView?.includes(originCharacter._id)
      ) {
        otherCharacter.otherPlayersInView?.push(originCharacter._id);
        otherCharacter.otherPlayersInView = _.uniq(otherCharacter.otherPlayersInView);

        await otherCharacter.save();
      }
    }

    originCharacter.otherPlayersInView = otherCharactersIds;
    await originCharacter.save();
  }

  public async getCharactersInView(character: ICharacter, idsOnly: boolean = true): Promise<ICharacter[] | string[]> {
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

    if (idsOnly) {
      return otherCharactersInView.map((character) => character._id);
    }

    return otherCharactersInView as unknown as ICharacter[];
  }
}
