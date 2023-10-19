import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { isAdminMiddleware } from "@providers/middlewares/IsAdminMiddleware";
import { controller, httpGet, interfaces, response } from "inversify-express-utils";
import { ScriptsUseCase } from "./ScriptsUseCase";

@controller("/scripts", AuthMiddleware, isAdminMiddleware)
export class ScriptsController implements interfaces.Controller {
  constructor(private scriptsUseCase: ScriptsUseCase) {}

  @httpGet("/sample")
  public generateReportItems(@response() res): Promise<void> {
    return res.status(200).send({
      message: "This is a script run! Use it to change data, generate reports, etc",
    });
  }
}
