import { IUser } from "@entities/ModuleSystem/UserModel";
import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { DTOValidatorMiddleware } from "@providers/middlewares/DTOValidatorMiddleware";
import { controller, httpPatch, interfaces, request, requestBody } from "inversify-express-utils";

import { UserUpdateDTO } from "../UserDTO";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

@controller("/users", AuthMiddleware)
export class UpdateUserController implements interfaces.Controller {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  @httpPatch("/", DTOValidatorMiddleware(UserUpdateDTO))
  private async update(@requestBody() userUpdateDTO: UserUpdateDTO, @request() req): Promise<IUser> {
    const user = req.user as IUser;

    return await this.updateUserUseCase.update(user, userUpdateDTO);
  }
}
