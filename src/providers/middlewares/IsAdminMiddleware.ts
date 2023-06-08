import { UserTypes } from "@rpg-engine/shared";
import { IUser } from "../../entities/ModuleSystem/UserModel";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { TS } from "../translation/TranslationHelper";
import { IAuthenticatedRequest } from "../types/ServerTypes";

export const isAdminMiddleware = (req: IAuthenticatedRequest, res, next): void => {
  const user = req.user as IUser;

  if (user.role !== UserTypes.Admin) {
    throw new UnauthorizedError(TS.translate("auth", "adminOnlyResource"));
  } else {
    next();
  }
};
