import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
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

      await this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "TotalAvailableGold", async () => {
        const allGoldCoins = (await Item.find({ key: OthersBlueprint.GoldCoin })
          .lean()
          .select("_id stackQty")) as IItem[];

        for (const goldCoin of allGoldCoins) {
          const { stackQty } = goldCoin;

          if (stackQty) {
            totalGold += stackQty;
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
