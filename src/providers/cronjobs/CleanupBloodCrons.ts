import nodeCron from "node-cron";
import { provide } from "inversify-binding-decorators";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { EffectsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";

@provide(CleanupBloodCrons)
export class CleanupBloodCrons {
  public schedule(): void {
    nodeCron.schedule("* * * * *", async () => {
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
