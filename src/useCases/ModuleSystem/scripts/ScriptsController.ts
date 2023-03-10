import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { isAdminMiddleware } from "@providers/middlewares/IsAdminMiddleware";
import { controller, httpGet, interfaces, response } from "inversify-express-utils";
import { ScriptsUseCase } from "./ScriptsUseCase";

@controller("/scripts", AuthMiddleware, isAdminMiddleware)
export class ScriptsController implements interfaces.Controller {
  constructor(private scriptsUserCase: ScriptsUseCase) {}

  @httpGet("/adjust-speed")
  public async adjustSpeed(@response() res): Promise<void> {
    await this.scriptsUserCase.setAllBaseSpeedsToStandard();

    return res.status(200).send({
      message: "Speed adjusted",
    });
  }

  @httpGet("/initial-coordinates")
  public async initialCoordinates(@response() res): Promise<void> {
    // update all initial coordinates from users performatically

    await this.scriptsUserCase.adjustInitialCoordinates();

    return res.status(200).send({
      message: "Initial coordinates adjusted succesfully",
    });
  }
}
