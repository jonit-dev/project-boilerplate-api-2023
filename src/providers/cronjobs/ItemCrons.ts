import { Item } from "@entities/ModuleInventory/ItemModel";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(ItemCrons)
export class ItemCrons {
  public schedule(): void {
    nodeCron.schedule("*/10 * * * *", async () => {
      // find all items with decay time

      const items = await Item.find({
        decayTime: {
          $lte: new Date(),
        },
      });

      for (const item of items) {
        await item.remove();
      }
    });
  }
}
