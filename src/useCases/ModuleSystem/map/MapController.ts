import { cache } from "@providers/constants/CacheConstants";
import { controller, httpGet, interfaces, requestParam } from "inversify-express-utils";
import { GetMapMetadataUseCase } from "./GetMapMetadataUseCase";

@controller("/maps")
export class MapController implements interfaces.Controller {
  constructor(private getMapMetadata: GetMapMetadataUseCase) {}

  @httpGet("/:mapName/metadata", cache("24 hours"))
  public mapMetadata(@requestParam() params): object {
    return this.getMapMetadata.execute(params.mapName);
  }
}
