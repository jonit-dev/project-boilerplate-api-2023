import { IUser, User } from "@entities/ModuleSystem/UserModel";
import { UserRepository } from "@repositories/ModuleSystem/user/UserRepository";
import { provide } from "inversify-binding-decorators";

import { UserUpdateDTO } from "../UserDTO";

@provide(UpdateUserUseCase)
export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  public async update(user: IUser, updateFields: UserUpdateDTO): Promise<IUser> {
    return await this.userRepository.update(User, user._id, updateFields, null, user);
  }
}
