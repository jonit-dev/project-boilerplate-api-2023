import { Item } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { provide } from "inversify-binding-decorators";

@provide(ItemCoordinates)
export class ItemCoordinates {
  @TrackNewRelicTransaction()
  public async removeItemCoordinates(item): Promise<void> {
    await Item.updateOne(
      {
        _id: item._id,
      },
      {
        $unset: {
          x: "",
          y: "",
          scene: "",
        },
      }
    );
  }
}
