import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ScriptsUseCase)
export class ScriptsUseCase {
  public async setAllBaseSpeedsToStandard(): Promise<void> {
    try {
      await Character.updateMany(
        {},
        {
          $set: {
            baseSpeed: MovementSpeed.Standard,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  public async adjustInitialCoordinates(): Promise<void> {
    try {
      await Character.updateMany(
        {},
        {
          $set: {
            x: FromGridX(110),
            y: FromGridY(106),
            initialX: FromGridX(110),
            initialY: FromGridY(106),
            scene: "ilya",
          },
        }
      );
    } catch (error) {
      console.error(error);

      throw new BadRequestError("Failed to execute script!");
    }
  }
}
