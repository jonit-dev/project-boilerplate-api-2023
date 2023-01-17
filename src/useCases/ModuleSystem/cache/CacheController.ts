import { cache } from "@providers/constants/CacheConstants";
import { ForbiddenError } from "@providers/errors/ForbiddenError";
import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { UserTypes } from "@rpg-engine/shared";
import { controller, httpGet, interfaces, request } from "inversify-express-utils";

@controller("/cache", AuthMiddleware)
export class CacheController implements interfaces.Controller {
  @httpGet("/purge")
  public purge(@request() req): object {
    const user = req.user;

    if (user.role !== UserTypes.Admin) {
      return new ForbiddenError("You're not authorized to access this resource.");
    }

    cache.clear();

    return { message: "Cache purged" };
  }
}
