import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { NewRelicMetricCategory, NewRelicSubCategory } from "@providers/types/NewRelicTypes";
import { provide } from "inversify-binding-decorators";
import { CronJobScheduler } from "./CronJobScheduler";

@provide(TotalAvailableGold)
export class TotalAvailableGold {
  constructor(private newRelic: NewRelic, private cronJobScheduler: CronJobScheduler) {}

  public schedule(): void {
    this.cronJobScheduler.uniqueSchedule("total-available-gold", "0 4 * * *", async () => {
      let totalGold = 0;

      const allGoldCoins = (await Item.find({ key: OthersBlueprint.GoldCoin })
        .lean()
        .select("_id stackQty")) as IItem[];

      for (const goldCoin of allGoldCoins) {
        const { stackQty } = goldCoin;

        if (stackQty) {
          totalGold += stackQty;
        }
      }

      this.newRelic.trackMetric(
        NewRelicMetricCategory.Count,
        NewRelicSubCategory.Items,
        "TotalAvailableGold",
        Math.round(totalGold)
      );
    });
  }
}
