import { Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { EffectsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { ItemSubType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(CleanupBloodCrons)
export class CleanupBloodCrons {
  constructor(private newRelic: NewRelic) {}

  public schedule(): void {
    nodeCron.schedule("*/5 * * * *", () => {
      this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "CleanupBloodCrons", async () => {
        const fiveMinAgo = new Date();
        fiveMinAgo.setMinutes(fiveMinAgo.getMinutes() - 5);

        const expiredGroundBlood = await Item.find({
          createdAt: { $lt: fiveMinAgo },
          key: EffectsBlueprint.GroundBlood,
          subType: { $ne: ItemSubType.DeadBody },
        });

        for (const groundBlood of expiredGroundBlood) {
          await groundBlood.remove();
        }
      });
    });
  }
}
