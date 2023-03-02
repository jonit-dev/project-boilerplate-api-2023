import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
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
}
