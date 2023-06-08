import { IUser } from "@entities/ModuleSystem/UserModel";
import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { Response } from "express";
import { controller, httpGet, interfaces } from "inversify-express-utils";

import { IAuthenticatedRequest } from "../../../../providers/types/ServerTypes";
import { OwnInfoUserUseCase } from "./OwnInfoUserUseCase";

@controller("/users")
export class OwnInfoUserController implements interfaces.Controller {
  constructor(private ownInfoUseCase: OwnInfoUserUseCase) {}

  @httpGet("/self", AuthMiddleware)
  private async ownInfo(req: IAuthenticatedRequest, res: Response): Promise<IUser> {
    const user = req.user;

    return await this.ownInfoUseCase.getUserInfo(user);
  }
}
