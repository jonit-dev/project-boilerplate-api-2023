import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { provide } from "inversify-binding-decorators";

@provide(ScriptsUseCase)
export class ScriptsUseCase {
  public async adjustAttackSpeed(): Promise<any> {
    try {
      await Character.updateMany(
        {},
        {
          $set: {
            attackIntervalSpeed: 1500,
          },
        }
      );
    } catch (error) {
      console.error(error);

      throw new BadRequestError("Failed to execute script!");
    }
  }
}
