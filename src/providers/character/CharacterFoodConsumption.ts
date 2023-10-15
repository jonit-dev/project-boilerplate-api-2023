import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { FOOD_CONSUMPTION_INTERVAL, MAX_FOOD_CONSUMPTION } from "@providers/constants/UsableItemsConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";

@provide(CharacterFoodConsumption)
export class CharacterFoodConsumption {
  constructor(private inMemoryHashTable: InMemoryHashTable, private socketMessaging: SocketMessaging) {}

  @TrackNewRelicTransaction()
  public async tryConsumingFood(character: ICharacter): Promise<boolean> {
    const canEat = await this.isCharacterFull(character._id);

    if (!canEat) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you're full.");
      return false;
    }

    await this.consumeFood(character._id);

    return true;
  }

  public async clearAllFoodConsumption(): Promise<void> {
    await this.inMemoryHashTable.deleteAll("character-food-consumption");
  }

  private async consumeFood(characterId: string): Promise<void> {
    const foodConsumption = Number(await this.inMemoryHashTable.get("character-food-consumption", characterId)) || 0;

    await this.inMemoryHashTable.set("character-food-consumption", characterId, foodConsumption + 1);

    setTimeout(async () => {
      const foodConsumption = Number(await this.inMemoryHashTable.get("character-food-consumption", characterId)) || 0;

      await this.inMemoryHashTable.set("character-food-consumption", characterId, foodConsumption - 1);
    }, FOOD_CONSUMPTION_INTERVAL);
  }

  private async isCharacterFull(characterId: string): Promise<boolean> {
    const foodConsumption = Number(await this.inMemoryHashTable.get("character-food-consumption", characterId)) || 0;

    return foodConsumption < MAX_FOOD_CONSUMPTION;
  }
}
