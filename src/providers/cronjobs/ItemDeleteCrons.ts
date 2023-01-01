import { Item } from "@entities/ModuleInventory/ItemModel";
import nodeCron from "node-cron";
import { provide } from "inversify-binding-decorators";

@provide(ItemDeleteCrons)
export class ItemDeleteCrons {
  public schedule(): void {
    nodeCron.schedule("0 0 * * *", async () => {
      await Item.deleteMany({ x: { $exists: true }, y: { $exists: true }, scene: { $exists: true } });
    });
  }
}
