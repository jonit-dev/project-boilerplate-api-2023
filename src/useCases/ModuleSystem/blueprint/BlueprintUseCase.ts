import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { provide } from "inversify-binding-decorators";
import { BlueprintManager, BlueprintNamespaces } from "../../../providers/blueprint/BlueprintManager";

@provide(BlueprintUseCase)
export class BlueprintUseCase {
  constructor(private blueprintManager: BlueprintManager) {}

  @TrackNewRelicTransaction()
  public async getBluePrintsValues(namespace: BlueprintNamespaces): Promise<any[]> {
    const blueprintData = await this.blueprintManager.getAllBlueprintValues(namespace);
    return blueprintData;
  }
}
