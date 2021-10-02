import { provide } from "inversify-binding-decorators";

import { BadRequestError } from "@providers/errors/BadRequestError";
import { TS } from "@providers/translation/TranslationHelper";
import { UserRepository } from "@repositories/ModuleSystem/user/UserRepository";

@provide(UnsubscribeUserUseCase)
export class UnsubscribeUserUseCase {
  constructor(private userRepository: UserRepository) {}

  public async unsubscribeUser(email: string): Promise<void> {
    const user = await this.userRepository.findUser({ email });

    if (user.unsubscribed === true) {
      throw new BadRequestError(TS.translate("users", "userAlreadyUnsubscribed"));
    }

    user.unsubscribed = true;
    await user.save();
  }
}
