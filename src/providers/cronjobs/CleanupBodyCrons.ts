import { NewRelic } from "@providers/analytics/NewRelic";
import { ItemContainerBodyCleaner } from "@providers/item/cleaner/ItemContainerBodyCleaner";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(CleanupBodyCrons)
export class CleanupBodyCrons {
  constructor(private newRelic: NewRelic, private itemContainerCleaner: ItemContainerBodyCleaner) {}

  public schedule(): void {
    nodeCron.schedule("*/3 * * * *", async () => {
      await this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "CleanupBodyCrons", async () => {
        await this.itemContainerCleaner.cleanupBodies();
      });
    });
  }
}
