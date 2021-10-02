import { IUser, User } from "@entities/ModuleSystem/UserModel";
import { TS } from "@providers/translation/TranslationHelper";
import { UserRepository } from "@repositories/ModuleSystem/user/UserRepository";
import { provide } from "inversify-binding-decorators";

import { TransactionalEmail } from "../../../../../emails/TransactionalEmail";
import { appEnv } from "../../../../providers/config/env";
import { ConflictError } from "../../../../providers/errors/ConflictError";
import { AuthSignUpDTO } from "../AuthDTO";

@provide(SignUpUseCase)
export class SignUpUseCase {
  constructor(private userRepository: UserRepository) {}

  public async signUp(authSignUpDTO: AuthSignUpDTO): Promise<IUser> {
    const { email, password, passwordConfirmation } = authSignUpDTO;

    // check if provided password and confirmation password are the same!
    if (password !== passwordConfirmation) {
      throw new ConflictError(TS.translate("auth", "passwordDoesNotMatchConfirmation"));
    }

    // first, check if an user with the same e-mail already exists
    if (await User.checkIfExists(email)) {
      throw new ConflictError(TS.translate("users", "userAlreadyExists", { email }));
    }

    const newUser = await this.userRepository.signUp(authSignUpDTO);

    if (newUser) {
      console.log("🤖 Submitting new user's welcome e-mail");

      await TransactionalEmail.send(newUser.email, TS.translate("email", "welcome"), "welcome", {
        newAccountEmailTitle: TS.translate("email", "welcome"),
        newAccountEmailFirstParagraph: TS.translate("email", "newAccountEmailFirstParagraph", {
          appName: appEnv.general.APP_NAME!,
        }),
        newAccountEmailForReference: TS.translate("email", "newAccountEmailForReference"),
        userEmail: newUser.email,
        newAccountEmailBottom: TS.translate("email", "newAccountEmailBottom", { appName: appEnv.general.APP_NAME! }),
      });
    }

    return newUser;
  }
}
