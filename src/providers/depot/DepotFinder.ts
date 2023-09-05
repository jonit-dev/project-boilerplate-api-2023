import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Depot, IDepot } from "@entities/ModuleDepot/DepotModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { provide } from "inversify-binding-decorators";

@provide(DepotFinder)
export class DepotFinder {
  public async findDepotWithSlots(character: ICharacter): Promise<IDepot | undefined> {
    const depots = (await Depot.find({ owner: character._id }).lean()) as IDepot[];

    for (const depot of depots) {
      const itemContainer = await ItemContainer.findById(depot.itemContainer);

      if (!itemContainer) {
        continue;
      }

      const hasSlots = itemContainer.emptySlotsQty > 0;

      if (hasSlots) {
        return depot;
      }
    }
  }
}
