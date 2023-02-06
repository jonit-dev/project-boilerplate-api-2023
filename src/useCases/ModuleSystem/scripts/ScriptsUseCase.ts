import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { User } from "@entities/ModuleSystem/UserModel";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ScriptsUseCase)
export class ScriptsUseCase {
  public async adjustAttackSpeed(): Promise<void> {
    try {
      await Character.updateMany(
        {},
        {
          $set: {
            attackIntervalSpeed: 1700,
          },
        }
      );
    } catch (error) {
      console.error(error);

      throw new BadRequestError("Failed to execute script!");
    }
  }

  public async adjustInitialCoordinates(): Promise<void> {
    try {
      await Character.updateMany(
        {},
        {
          $set: {
            x: FromGridX(35),
            y: FromGridY(44),
            initialX: FromGridX(35),
            initialY: FromGridY(44),
            scene: "ilya",
          },
        }
      );
    } catch (error) {
      console.error(error);

      throw new BadRequestError("Failed to execute script!");
    }
  }

  public async setAllEmailsToLowerCase(): Promise<void> {
    const users = await User.find({});

    for (const user of users) {
      try {
        user.email = user.email.toLowerCase();
        await user.save();
      } catch (error) {
        console.error(error);
        continue;
      }
    }
  }
}
