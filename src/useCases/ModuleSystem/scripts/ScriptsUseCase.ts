import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { ItemContainerBodyCleaner } from "@providers/item/cleaner/ItemContainerBodyCleaner";
import { ItemMissingReferenceCleaner } from "@providers/item/cleaner/ItemMissingReferenceCleaner";
import { ItemReportGenerator } from "@providers/item/ItemReportGenerator";
import { MarketplaceCleaner } from "@providers/marketplace/MarketplaceCleaner";
import { FromGridX, FromGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ScriptsUseCase)
export class ScriptsUseCase {
  constructor(
    private marketplaceCleaner: MarketplaceCleaner,
    private itemReportGenerator: ItemReportGenerator,
    private itemMissingReferenceCleaner: ItemMissingReferenceCleaner,
    private itemContainerBodyCleaner: ItemContainerBodyCleaner
  ) {}

  public async cleanupItems(): Promise<void> {
    await this.itemMissingReferenceCleaner.cleanupItemsWithoutOwnership();
    await this.itemContainerBodyCleaner.cleanupBodies();
  }

  public async generateReportItems(): Promise<void> {
    await this.itemReportGenerator.exec();
  }

  public async marketplaceClean(): Promise<void> {
    await this.marketplaceCleaner.clean();
  }

  public async setAllBaseSpeedsToStandard(): Promise<void> {
    try {
      await Character.updateMany(
        {},
        {
          $set: {
            baseSpeed: MovementSpeed.Standard,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  public async adjustInitialCoordinates(): Promise<void> {
    try {
      await Character.updateMany(
        {},
        {
          $set: {
            x: FromGridX(110),
            y: FromGridY(106),
            initialX: FromGridX(110),
            initialY: FromGridY(106),
            scene: "ilya",
          },
        }
      );
    } catch (error) {
      console.error(error);

      throw new BadRequestError("Failed to execute script!");
    }
  }
}
