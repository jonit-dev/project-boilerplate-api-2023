import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { IUser } from "@entities/ModuleSystem/UserModel";
import { USER_CONTROL_ONLINE } from "@providers/constants/ServerConstants";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { provide } from "inversify-binding-decorators";

@provide(LoginCharacterUseCase)
export class LoginCharacterUseCase {
  public async checkLimit(user: IUser): Promise<boolean> {
    const maxCharacterOnlinePerUser = await Character.countDocuments({ owner: user._id, isOnline: true });

    if (maxCharacterOnlinePerUser >= USER_CONTROL_ONLINE.MAX_NUMBER_ACC_PER_USER) {
      throw new BadRequestError(
        "Sorry. Number of characters online per player reached. Please try again in a few minutes."
      );
    }

    const allUsersOnline = await Character.find({ isOnline: true }).select("owner").exec();

    const result = allUsersOnline.map((obj) => ({ _id: obj._id, owner: obj.owner.toString() }));
    const distinctOwners = result.reduce((acc, { owner }) => {
      acc[owner] = (acc[owner] || 0) + 1;
      return acc;
    }, {});

    const uniqueUsersOnline = Object.keys(distinctOwners).length;

    if (uniqueUsersOnline > USER_CONTROL_ONLINE.MAX_NUMBER_OF_PLAYERS) {
      throw new BadRequestError("Sorry, max number of online players reached. Please try again in a few minutes.");
    }

    return true;
  }
}
