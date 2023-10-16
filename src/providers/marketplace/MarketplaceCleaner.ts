import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { MarketplaceItem } from "@entities/ModuleMarketplace/MarketplaceItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { DepotFinder } from "@providers/depot/DepotFinder";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";

@provide(MarketplaceCleaner)
export class MarketplaceCleaner {
  constructor(private depotFinder: DepotFinder, private characterItemContainer: CharacterItemContainer) {}

  @TrackNewRelicTransaction()
  public async clean(): Promise<void> {
    console.log("Cleaning marketplace junk...");
    const totalCleaned1 = await this.deleteItemsFromInactiveCharacters();
    const totalCleaned2 = await this.rollbackItemsMoreThan1WeekOld();

    const total = totalCleaned1 + totalCleaned2;

    console.log(`${total} items modified from marketplace`);
  }

  @TrackNewRelicTransaction()
  public async deleteItemsFromInactiveCharacters(): Promise<number> {
    let deletedItems = 0;

    const moreThan2MonthsAgo = dayjs().subtract(2, "month").toDate();

    const marketplaceEntries = await MarketplaceItem.find({}).lean();

    for (const entry of marketplaceEntries) {
      const character = (await Character.findById(entry.owner).lean()) as ICharacter;

      if (!character) {
        await MarketplaceItem.deleteOne({ _id: entry._id });
        continue;
      }

      const characterLastActive = dayjs(character.updatedAt);

      // if last activity was more than 2 months ago, delete the item

      const lastActivityMoreThan2MonthsAgo = characterLastActive.isBefore(moreThan2MonthsAgo);

      if (lastActivityMoreThan2MonthsAgo) {
        const depot = await this.depotFinder.findDepotWithSlots(character);
        if (!depot) {
          await MarketplaceItem.deleteOne({ _id: entry._id });
          continue;
        }
        const item = await Item.findById(entry.item);

        if (!item) {
          await MarketplaceItem.deleteOne({ _id: entry._id });
          continue;
        }

        const addItemOptions = {
          shouldAddOwnership: true,
          shouldAddAsCarriedItem: false,
        };
        const hasAdded = await this.characterItemContainer.addItemToContainer(
          item,
          character,
          depot.itemContainer?.toString()!,
          addItemOptions
        );

        if (hasAdded) {
          await MarketplaceItem.deleteOne({ _id: entry._id });
          continue;
        }

        // if was not added to the container, just delete this junk
        await MarketplaceItem.deleteOne({ _id: entry._id });

        if (item) {
          await item.remove();
        }
        deletedItems++;
      }
    }
    return deletedItems;
  }

  @TrackNewRelicTransaction()
  public async rollbackItemsMoreThan1WeekOld(): Promise<number> {
    try {
      const moreThan1WeekAgo = dayjs().subtract(1, "week").toDate();
      const marketplaceEntries = await MarketplaceItem.find({
        createdAt: { $lt: moreThan1WeekAgo },
      }).lean();

      let rolledBackItems = 0;
      const idsToDelete: string[] = [];

      for (const entry of marketplaceEntries) {
        const character = (await Character.findOne({ _id: entry.owner }).lean()) as ICharacter;
        if (!character) {
          idsToDelete.push(entry._id);
          continue;
        }

        const depot = await this.depotFinder.findDepotWithSlots(character);
        if (!depot) {
          idsToDelete.push(entry._id);
          continue;
        }

        const item = (await Item.findById(entry.item)) as IItem;
        if (!item) {
          idsToDelete.push(entry._id);
          continue;
        }

        const addItemOptions = {
          shouldAddOwnership: true,
          shouldAddAsCarriedItem: false,
        };
        const hasAdded = await this.characterItemContainer.addItemToContainer(
          item,
          character,
          depot.itemContainer?.toString()!,
          addItemOptions
        );

        if (hasAdded) {
          idsToDelete.push(entry._id);
          rolledBackItems++;
        }
      }

      if (idsToDelete.length > 0) {
        await MarketplaceItem.deleteMany({ _id: { $in: idsToDelete } });
      }

      return rolledBackItems;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }
}
