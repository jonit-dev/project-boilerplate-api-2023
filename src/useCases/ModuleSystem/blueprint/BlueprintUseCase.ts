import { BlueprintManager, BlueprintNamespaces } from "../../../providers/blueprint/BlueprintManager";
import { provide } from "inversify-binding-decorators";

@provide(BlueprintUseCase)
export class BlueprintUseCase {
  constructor(private blueprintManager: BlueprintManager) {}

  public async getBluePrintsValues(namespace: BlueprintNamespaces) {
    const blueprintData = await this.blueprintManager.getAllBlueprintValues(namespace);
    return blueprintData;
  }
}
