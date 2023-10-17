import { MarketplaceCleaner } from "@providers/marketplace/MarketplaceCleaner";
import { provide } from "inversify-binding-decorators";
import { CronJobScheduler } from "./CronJobScheduler";

@provide(MarketplaceCrons)
export class MarketplaceCrons {
  constructor(private marketplaceCleaner: MarketplaceCleaner, private cronJobScheduler: CronJobScheduler) {}

  public schedule(): void {
    // once per week, monday at midnight
    this.cronJobScheduler.uniqueSchedule("marketplace-cron-rollback-items", "0 0 * * 1", async () => {
      await this.marketplaceCleaner.rollbackItemsMoreThan1WeekOld();
    });

    // once per week, friday, at midnight
    this.cronJobScheduler.uniqueSchedule("marketplace-cron-delete-items-inactive-characters", "0 0 * * 5", async () => {
      await this.marketplaceCleaner.deleteItemsFromInactiveCharacters();
    });
  }
}
