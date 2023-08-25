import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import {
  NewRelicMetricCategory,
  NewRelicSubCategory,
  NewRelicTransactionCategory,
} from "@providers/types/NewRelicTypes";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(TotalAvailableGold)
export class TotalAvailableGold {
  constructor(private newRelic: NewRelic) {}

  public schedule(): void {
    nodeCron.schedule("0 4 * * *", async () => {
      let totalGold = 0;
      await this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "TotalAvaliableGold", async () => {
        const allItems = (await Item.find({ canSell: true })
          .lean()
          .select("_id maxStackSize basePrice stackQty")) as IItem[];

        for (const { basePrice, maxStackSize, stackQty } of allItems) {
          if (basePrice && maxStackSize) {
            totalGold += (stackQty || 1) * basePrice;
          }
        }
      });

      this.newRelic.trackMetric(
        NewRelicMetricCategory.Count,
        NewRelicSubCategory.Items,
        "TotalAvailableGold",
        totalGold
      );
    });
  }
}
