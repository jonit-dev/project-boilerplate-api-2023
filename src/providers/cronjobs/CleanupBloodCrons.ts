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
    nodeCron.schedule("*/1 * * * *", async () => {
      await this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "CleanupBloodCrons", async () => {
        const fiveMinAgo = new Date();
        fiveMinAgo.setMinutes(fiveMinAgo.getMinutes() - 5);

        await Item.deleteMany({
          createdAt: { $lt: fiveMinAgo },
          key: EffectsBlueprint.GroundBlood,
          subType: { $ne: ItemSubType.DeadBody },
        });
      });
    });
  }
}
