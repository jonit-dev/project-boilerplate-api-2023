import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { provide } from "inversify-binding-decorators";

import { NewRelic } from "@providers/analytics/NewRelic";
import { appEnv } from "@providers/config/env";
import { ITEM_CLEANUP_THRESHOLD } from "@providers/constants/ItemConstants";
import { NewRelicMetricCategory } from "@providers/types/NewRelicTypes";

@provide(ItemCleanup)
export class ItemCleanup {
  constructor(private newRelic: NewRelic) {}

  public tryCharacterDroppedItemsCleanup(character: ICharacter): void {
    if (appEnv.general.IS_UNIT_TEST) return;

    setTimeout(async () => {
      const totalDroppedItems = await Item.countDocuments({ droppedBy: character._id });

      this.newRelic.trackMetric(NewRelicMetricCategory.Count, "Items/Dropped", totalDroppedItems);

      if (totalDroppedItems < ITEM_CLEANUP_THRESHOLD) return;

      const lastDroppedItem = await Item.findOne({ droppedBy: character._id }).sort({ createdAt: 1 }).limit(1);

      if (lastDroppedItem) {
        await lastDroppedItem.remove();
      }
    }, 1000);
  }
}
