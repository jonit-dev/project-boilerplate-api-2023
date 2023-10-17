import { Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { EffectsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemSubType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CronJobScheduler } from "./CronJobScheduler";

@provide(CleanupBloodCrons)
export class CleanupBloodCrons {
  constructor(private newRelic: NewRelic, private cronJobScheduler: CronJobScheduler) {}

  public schedule(): void {
    this.cronJobScheduler.uniqueSchedule("cleanup-blood-crons", "*/1 * * * *", async () => {
      const fiveMinAgo = new Date();
      fiveMinAgo.setMinutes(fiveMinAgo.getMinutes() - 5);

      await Item.deleteMany({
        createdAt: { $lt: fiveMinAgo },
        key: EffectsBlueprint.GroundBlood,
        subType: { $ne: ItemSubType.DeadBody },
      });
    });
  }
}
