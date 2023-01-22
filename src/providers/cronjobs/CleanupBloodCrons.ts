import { Item } from "@entities/ModuleInventory/ItemModel";
import { EffectsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(CleanupBloodCrons)
export class CleanupBloodCrons {
  public schedule(): void {
    nodeCron.schedule("*/5 * * * *", async () => {
      const fiveMinAgo = new Date();
      fiveMinAgo.setMinutes(fiveMinAgo.getMinutes() - 5);

      const expiredGroundBlood = await Item.find({
        createdAt: { $lt: fiveMinAgo },
        key: EffectsBlueprint.GroundBlood,
      });

      for (const groundBlood of expiredGroundBlood) {
        await groundBlood.remove();
      }
    });
  }
}
