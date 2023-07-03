import { Item } from "@entities/ModuleInventory/ItemModel";
import { provide } from "inversify-binding-decorators";

@provide(ItemCoordinates)
export class ItemCoordinates {
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
