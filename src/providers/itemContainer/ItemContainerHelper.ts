import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";

import { Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";
import { IItemContainer, ItemContainerType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ItemContainerHelper)
export class ItemContainerHelper {
  constructor(
    private characterInventory: CharacterInventory,
    private newRelic: NewRelic,
    private characterRepository: CharacterRepository
  ) {}

  public async getContainerType(itemContainer: IItemContainer): Promise<ItemContainerType | undefined> {
    return await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "ItemContainerHelper.getContainerType",
      async () => {
        try {
          const item = await Item.findById(itemContainer.parentItem).lean();

          if (!item) {
            throw new Error("Failed to get item type: item not found");
          }

          if (item.name.includes("body")) {
            return ItemContainerType.Loot;
          }

          if (item.x && item.y && item.scene) {
            return ItemContainerType.MapContainer;
          }

          const owner = (await this.characterRepository.findById(item.owner!.toString())) as unknown as ICharacter;
          const inventory = await this.characterInventory.getInventory(owner);

          if (item?._id.toString() === inventory?._id.toString()) {
            return ItemContainerType.Inventory;
          }

          return ItemContainerType.Loot; // last resort, lets consider its a loot container
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
}
