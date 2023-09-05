import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { isAdminMiddleware } from "@providers/middlewares/IsAdminMiddleware";
import { controller, httpGet, interfaces, response } from "inversify-express-utils";
import { ScriptsUseCase } from "./ScriptsUseCase";

@controller("/scripts", AuthMiddleware, isAdminMiddleware)
export class ScriptsController implements interfaces.Controller {
  constructor(private scriptsUseCase: ScriptsUseCase) {}

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

  @httpGet("/max-health-max-mana")
  public async maxHealthMaxMana(@response() res): Promise<void> {
    // update all initial coordinates from users performatically

    await this.scriptsUseCase.adjustMaxHealthMaxMana();

    return res.status(200).send({
      message: "Max HP/Mana adjusted and buffs removed",
    });
  }

  @httpGet("/spell-fix")
  public async spellFix(@response() res): Promise<void> {
    // update all initial coordinates from users performatically

    await this.scriptsUseCase.spellNameFix();

    return res.status(200).send({
      message: "Eagles Eye Fixes",
    });
  }

  @httpGet("/fix-bugged-depots")
  public async buggedDepots(@response() res): Promise<void> {
    // update all initial coordinates from users performatically

    await this.scriptsUseCase.fixWrongDepot();

    return res.status(200).send({
      message: "Depot fixed",
    });
  }

  @httpGet("/fix-depot-reference")
  public async fixDepotReference(@response() res): Promise<void> {
    await this.scriptsUseCase.fixAllDepotReferences();

    return res.status(200).send({
      message: "Depot reference fixed",
    });
  }
}
