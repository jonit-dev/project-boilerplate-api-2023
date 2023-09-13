import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { isAdminMiddleware } from "@providers/middlewares/IsAdminMiddleware";
import { controller, httpGet, interfaces, response } from "inversify-express-utils";
import { ScriptsUseCase } from "./ScriptsUseCase";

@controller("/scripts", AuthMiddleware, isAdminMiddleware)
export class ScriptsController implements interfaces.Controller {
  constructor(private scriptsUseCase: ScriptsUseCase) {}

  @httpGet("/reports/items")
  public async generateReportItems(@response() res): Promise<void> {
    await this.scriptsUseCase.generateReportItems();

    return res.status(200).send({
      message: "Report generated!",
    });
  }

  @httpGet("/cleanup/items")
  public async cleanupItems(@response() res): Promise<void> {
    await this.scriptsUseCase.cleanupItems();

    return res.status(200).send({
      message: "Items cleaned up!",
    });
  }

  @httpGet("/adjust-speed")
  public async adjustSpeed(@response() res): Promise<void> {
    await this.scriptsUseCase.setAllBaseSpeedsToStandard();

    return res.status(200).send({
      message: "Speed adjusted",
    });
  }

  @httpGet("/clean-marketplace")
  public async cleanMarketplace(@response() res): Promise<void> {
    await this.scriptsUseCase.marketplaceClean();

    return res.status(200).send({
      message: "Marketplace cleaned!",
    });
  }

  @httpGet("/initial-coordinates")
  public async initialCoordinates(@response() res): Promise<void> {
    // update all initial coordinates from users performatically

    await this.scriptsUseCase.adjustInitialCoordinates();

    return res.status(200).send({
      message: "Initial coordinates adjusted succesfully",
    });
  }
}
