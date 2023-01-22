import nodeCron from "node-cron";
import { provide } from "inversify-binding-decorators";
import { Item } from "@entities/ModuleInventory/ItemModel";

@provide(CleanupBodyCrons)
export class CleanupBodyCrons {
  public schedule(): void {
    nodeCron.schedule("* * * * *", async () => {
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);

      const charBodies = await Item.find({
        createdAt: { $lt: oneHourAgo },
        name: { $regex: /.*'s body$/ },
      });

      for (const charBody of charBodies) {
        await charBody.remove();
      }
    });
  }
}
