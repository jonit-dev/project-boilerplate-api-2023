import { AvailableBlueprints, BodiesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { BlueprintManager, BlueprintNamespaces } from "../../../providers/blueprint/BlueprintManager";
import { provide } from "inversify-binding-decorators";
import { Namespace } from "socket.io";

@provide(BlueprintUseCase)
export class BlueprintUseCase {
  constructor(private blueprintManager: BlueprintManager) {}

  public async getBluePrints(namespace: BlueprintNamespaces, key: AvailableBlueprints) {
    const blueprintData = await this.blueprintManager.getBlueprint(namespace, key);
    return blueprintData;
  }

  public async getBluePrintsKeys(namespace: BlueprintNamespaces) {
    const blueprintData = await this.blueprintManager.getAllBlueprintKeys(namespace);
    return blueprintData;
  }
}
