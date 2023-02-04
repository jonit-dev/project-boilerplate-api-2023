import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { isAdminMiddleware } from "@providers/middlewares/IsAdminMiddleware";
import { controller, httpGet, interfaces, response } from "inversify-express-utils";
import { ScriptsUseCase } from "./ScriptsUseCase";

@controller("/scripts", AuthMiddleware, isAdminMiddleware)
export class ScriptsController implements interfaces.Controller {
  constructor(private scriptsUserCase: ScriptsUseCase) {}

  @httpGet("/attack-speed")
  public async attackSpeed(@response() res): Promise<void> {
    // update all attackSpeed from users performatically

    await this.scriptsUserCase.adjustAttackSpeed();

    return res.status(200).send({
      message: "Attack speed adjusted succesfully",
    });
  }
}
