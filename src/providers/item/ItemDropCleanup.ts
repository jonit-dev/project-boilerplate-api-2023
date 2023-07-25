import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { provide } from "inversify-binding-decorators";

import { NewRelic } from "@providers/analytics/NewRelic";
import { appEnv } from "@providers/config/env";
import { ITEM_CLEANUP_THRESHOLD } from "@providers/constants/ItemConstants";
import { NewRelicMetricCategory, NewRelicSubCategory } from "@providers/types/NewRelicTypes";

@provide(ItemDropCleanup)
export class ItemDropCleanup {
  constructor(private newRelic: NewRelic) {}

  public tryCharacterDroppedItemsCleanup(character: ICharacter): void {
    if (appEnv.general.IS_UNIT_TEST) return;

    setTimeout(async () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      const totalDroppedItems = await Item.countDocuments({
        droppedBy: character._id,
        updatedAt: { $gte: oneHourAgo },
      });

      this.newRelic.trackMetric(NewRelicMetricCategory.Count, NewRelicSubCategory.Items, "Dropped", totalDroppedItems);

      if (totalDroppedItems < ITEM_CLEANUP_THRESHOLD) return;

      const lastDroppedItem = await Item.findOne({
        droppedBy: character._id,
        x: { $exists: true, $ne: null as any },
        y: { $exists: true, $ne: null as any },
        scene: { $exists: true, $ne: null as any },
        owner: { $in: [null, undefined] },
        isEquipped: { $ne: true },
        itemContainer: { $exists: false },
      })
        .sort({ createdAt: 1 })
        .limit(1);

      if (lastDroppedItem) {
        await lastDroppedItem.remove();
      }
    }, 1000);
  }
}
