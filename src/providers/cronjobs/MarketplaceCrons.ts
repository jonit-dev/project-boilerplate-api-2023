import { MarketplaceCleaner } from "@providers/marketplace/MarketplaceCleaner";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(MarketplaceCrons)
export class MarketplaceCrons {
  constructor(private marketplaceCleaner: MarketplaceCleaner) {}

  public schedule(): void {
    // once per day, at midnight
    nodeCron.schedule("0 0 * * *", async () => {
      await this.marketplaceCleaner.rollbackItemsMoreThan1WeekOld();
      await this.marketplaceCleaner.deleteItemsFromInactiveCharacters();
    });
  }
}
