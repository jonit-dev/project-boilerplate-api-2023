import { NewRelic } from "@providers/analytics/NewRelic";
import { ItemContainerBodyCleaner } from "@providers/item/cleaner/ItemContainerBodyCleaner";
import { provide } from "inversify-binding-decorators";
import { CronJobScheduler } from "./CronJobScheduler";

@provide(CleanupBodyCrons)
export class CleanupBodyCrons {
  constructor(
    private newRelic: NewRelic,
    private itemContainerCleaner: ItemContainerBodyCleaner,
    private cronJobScheduler: CronJobScheduler
  ) {}

  public schedule(): void {
    this.cronJobScheduler.uniqueSchedule("cleanup-body-crons", "*/3 * * * *", async () => {
      await this.itemContainerCleaner.cleanupBodies();
    });
  }
}
