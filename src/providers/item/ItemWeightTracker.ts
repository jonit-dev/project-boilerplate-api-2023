import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { ItemContainerHelper } from "@providers/itemContainer/ItemContainerHelper";
import { provide } from "inversify-binding-decorators";
@provide(ItemWeightTracker)
export class ItemWeightTracker {
  constructor(private itemContainerHelper: ItemContainerHelper) {}

  @TrackNewRelicTransaction()
  public async setItemWeightTracking(item: IItem, character: ICharacter): Promise<void> {
    // temp disabled
  }

  @TrackNewRelicTransaction()
  public async removeItemWeightTracking(item: IItem): Promise<void> {
    // temp disabled
  }
}
