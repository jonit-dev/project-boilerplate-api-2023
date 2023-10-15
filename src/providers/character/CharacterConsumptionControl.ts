import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { BASE_CONSUMPTION_INTERVAL, BASE_MAX_USABLE_CONSUMPTION } from "@providers/constants/UsableItemsConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ItemSubType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

interface IConsumptionMetadata {
  timeout: number;
  max: number;
}

interface ICharacterConsumption {
  [subtype: string]: number;
}

@provide(CharacterConsumptionControl)
export class CharacterConsumptionControl {
  constructor(private inMemoryHashTable: InMemoryHashTable, private socketMessaging: SocketMessaging) {}

  private consumptionCleanInterval = {
    [ItemSubType.Food]: {
      timeout: BASE_CONSUMPTION_INTERVAL,
      max: BASE_MAX_USABLE_CONSUMPTION,
    },
    [ItemSubType.Potion]: {
      timeout: BASE_CONSUMPTION_INTERVAL * 0.5,
      max: BASE_MAX_USABLE_CONSUMPTION * 2,
    },
  } as Record<ItemSubType, IConsumptionMetadata>;

  @TrackNewRelicTransaction()
  public async tryConsuming(character: ICharacter, itemSubtype: ItemSubType): Promise<boolean> {
    const canConsume = await this.isCharacterAbleToConsume(character._id, itemSubtype);

    if (!canConsume) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        `Sorry, you can't consume more ${itemSubtype.toLowerCase()}. Please wait...`
      );
      return false;
    }

    await this.consumeItem(character._id, itemSubtype);
    return true;
  }

  public async clearAllItemConsumption(): Promise<void> {
    await this.inMemoryHashTable.deleteAll("character-consumption-control");
  }

  private async consumeItem(characterId: string, itemSubtype: ItemSubType): Promise<void> {
    const characterData: ICharacterConsumption =
      (await this.inMemoryHashTable.get("character-consumption-control", characterId)) || {};
    characterData[itemSubtype] = (characterData[itemSubtype] || 0) + 1;
    await this.inMemoryHashTable.set("character-consumption-control", characterId, characterData);

    setTimeout(async () => {
      const characterData: ICharacterConsumption =
        (await this.inMemoryHashTable.get("character-consumption-control", characterId)) || {};
      characterData[itemSubtype] = (characterData[itemSubtype] || 1) - 1;
      await this.inMemoryHashTable.set("character-consumption-control", characterId, characterData);
    }, this.consumptionCleanInterval[itemSubtype]?.timeout);
  }

  private async isCharacterAbleToConsume(characterId: string, itemSubtype: ItemSubType): Promise<boolean> {
    const characterData: ICharacterConsumption =
      (await this.inMemoryHashTable.get("character-consumption-control", characterId)) || {};

    const hasConsumptionData = this.consumptionCleanInterval[itemSubtype];

    if (!hasConsumptionData) {
      return true;
    }

    const currentConsumption = characterData[itemSubtype] || 0;

    return currentConsumption < this.consumptionCleanInterval[itemSubtype].max;
  }
}
