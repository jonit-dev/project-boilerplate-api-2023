import { BlueprintManager, BlueprintNamespaces } from "../../../providers/blueprint/BlueprintManager";
import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { controller, httpGet, interfaces, request, requestParam } from "inversify-express-utils";
import { IAuthenticatedRequest } from "@providers/types/ServerTypes";
import { AvailableBlueprints } from "@providers/item/data/types/itemsBlueprintTypes";
import { BlueprintUseCase } from "./BlueprintUseCase";

@controller("/blueprints")
export class BlueprintController implements interfaces.Controller {
  constructor(private BlueprintUseCase: BlueprintUseCase) {}

  @httpGet("/:namespace/:key")
  private async getBlueprint(
    @requestParam("namespace") namespace: BlueprintNamespaces,
    @requestParam("key") key: AvailableBlueprints,
    @request() request: IAuthenticatedRequest
  ): Promise<any> {
    return await this.BlueprintUseCase.getBluePrints(namespace, key);
  }

  @httpGet("/:namespace")
  private async getBlueprintKey(@requestParam("namespace") namespace: BlueprintNamespaces): Promise<any> {
    return await this.BlueprintUseCase.getBluePrintsKeys(namespace);
  }
}
