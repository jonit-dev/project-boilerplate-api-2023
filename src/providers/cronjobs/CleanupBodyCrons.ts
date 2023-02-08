import { Item } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(CleanupBodyCrons)
export class CleanupBodyCrons {
  public schedule(): void {
    nodeCron.schedule("*/30 * * * *", async () => {
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);

      const charBodies = await Item.find({
        createdAt: { $lt: oneHourAgo },
        subType: ItemSubType.DeadBody,
      });

      for (const charBody of charBodies) {
        await charBody.remove();
      }
    });
  }
}
