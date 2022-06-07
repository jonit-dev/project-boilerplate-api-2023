import { controller, httpGet, interfaces, requestParam } from "inversify-express-utils";
import { GetMapHashUseCase } from "./GetMapHashUseCase";

@controller("/maps")
export class MapController implements interfaces.Controller {
  constructor(private getMapHashUseCase: GetMapHashUseCase) {}

  @httpGet("/:mapName/hash")
  public mapHash(@requestParam() params): object {
    return this.getMapHashUseCase.execute(params.mapName);
  }
}
