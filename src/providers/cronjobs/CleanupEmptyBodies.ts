import { IItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { ItemSubType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(CleanupEmptyBodyCrons)
export class CleanupEmptyBodyCrons {
  constructor(private newRelic: NewRelic) {}

  public schedule(): void {
    nodeCron.schedule("*/1 * * * *", async () => {
      console.log("🕒: Cleaning up empty dead bodies...");
      await this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "CleanupEmptyBodyCrons", async () => {
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
    });
  }
}
