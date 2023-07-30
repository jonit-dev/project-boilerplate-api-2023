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

  @httpGet("/max-health-max-mana")
  public async maxHealthMaxMana(@response() res): Promise<void> {
    // update all initial coordinates from users performatically

    await this.scriptsUserCase.adjustMaxHealthMaxMana();

    return res.status(200).send({
      message: "Max HP/Mana adjusted and buffs removed",
    });
  }

  @httpGet("/spell-fix")
  public async spellFix(@response() res): Promise<void> {
    // update all initial coordinates from users performatically

    await this.scriptsUserCase.spellNameFix();

    return res.status(200).send({
      message: "Eagles Eye Fixes",
    });
  }

  @httpGet("/fix-bugged-depots")
  public async buggedDepots(@response() res): Promise<void> {
    // update all initial coordinates from users performatically

    await this.scriptsUserCase.fixWrongDepot();

    return res.status(200).send({
      message: "Depot fixed",
    });
  }

  @httpGet("/fix-depot-reference")
  public async fixDepotReference(@response() res): Promise<void> {
    await this.scriptsUserCase.fixAllDepotReferences();

    return res.status(200).send({
      message: "Depot reference fixed",
    });
  }
}
