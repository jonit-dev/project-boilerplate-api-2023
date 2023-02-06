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

  @httpGet("/initial-coordinates")
  public async initialCoordinates(@response() res): Promise<void> {
    // update all initial coordinates from users performatically

    await this.scriptsUserCase.adjustInitialCoordinates();

    return res.status(200).send({
      message: "Initial coordinates adjusted succesfully",
    });
  }

  @httpGet("/update-emails-lowercase")
  public async updateEmailsLowercase(@response() res): Promise<void> {
    await this.scriptsUserCase.setAllEmailsToLowerCase();

    return res.status(200).send({
      message: "Emails adjusted succesfully",
    });
  }
}
