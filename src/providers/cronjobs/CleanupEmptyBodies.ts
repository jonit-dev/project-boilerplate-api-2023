import { IItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { ItemSubType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CronJobScheduler } from "./CronJobScheduler";

@provide(CleanupEmptyBodyCrons)
export class CleanupEmptyBodyCrons {
  constructor(private newRelic: NewRelic, private cronJobScheduler: CronJobScheduler) {}

  public schedule(): void {
    this.cronJobScheduler.uniqueSchedule("cleanup-empty-body-crons", "*/1 * * * *", async () => {
      const threeMinAgo = new Date();
      threeMinAgo.setMinutes(threeMinAgo.getMinutes() - 3);

      const charBodies = await Item.find({
        createdAt: { $lt: threeMinAgo },
        subType: ItemSubType.DeadBody,
      })
        .populate({ path: "itemContainer", select: "slots slotQty" })
        .exec();

      for (const charBody of charBodies) {
        const itemContainer = charBody.itemContainer as IItemContainer;
        if (itemContainer?.emptySlotsQty === itemContainer?.slotQty) {
          await charBody.remove();
        }
      }
    });
  }
}
