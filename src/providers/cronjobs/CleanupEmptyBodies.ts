import { IItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(CleanupEmptyBodyCrons)
export class CleanupEmptyBodyCrons {
  public schedule(): void {
    nodeCron.schedule("* * * * *", async () => {
      const oneMinAgo = new Date();
      oneMinAgo.setMinutes(oneMinAgo.getMinutes() - 1);

      const charBodies = await Item.find({
        createdAt: { $lt: oneMinAgo },
        subType: ItemSubType.DeadBody,
      })
        .populate({ path: "itemContainer", select: "slots slotQty" })
        .exec();

      for (const charBody of charBodies) {
        const itemContainer = charBody.itemContainer as IItemContainer;
        if (itemContainer.emptySlotsQty === itemContainer.slotQty) {
          await charBody.remove();
        }
      }
    });
  }
}
