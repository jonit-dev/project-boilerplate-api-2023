import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { NewRelicMetricCategory, NewRelicSubCategory } from "@providers/types/NewRelicTypes";

@provideSingleton(BattleCycle)
export class BattleCycle {
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(private characterValidation: CharacterValidation, private newRelic: NewRelic) {}

  public async init(
    character: ICharacter,
    targetId: string,
    attackIntervalSpeed: number,
    attackFn: () => Promise<void>
  ): Promise<void> {
    try {
      await this.stop(character._id.toString());

      if (this.intervals.has(character._id.toString())) {
        return;
      }

      const interval = setInterval(async () => {
        const hasBasicValidation = this.characterValidation.hasBasicValidation(character);

        if (!hasBasicValidation) {
          clearInterval(interval);
          return;
        }

        // if original target (init) is not the same as the current target, stop the interval

        const currentTargetId = await this.getCurrentTargetId(character._id.toString());

        if (!currentTargetId) {
          clearInterval(interval);
          return;
        }

        if (currentTargetId?.toString() !== targetId.toString()) {
          clearInterval(interval);
          return;
        }

        await attackFn();
      }, attackIntervalSpeed);

      this.intervals.set(character._id.toString(), interval);

      this.newRelic.trackMetric(NewRelicMetricCategory.Count, NewRelicSubCategory.Server, "CharacterBattleCycle", 1);
    } catch (error) {
      console.error(error);
    }
  }

  public stop(characterId: string): void {
    const interval = this.intervals.get(characterId);

    if (!interval) {
      return;
    }

    clearInterval(interval);

    this.intervals.delete(characterId);
  }

  private async getCurrentTargetId(characterId: string): Promise<string | undefined> {
    const character = (await Character.findById(characterId).select("target").lean()) as ICharacter;

    return character?.target?.id.toString();
  }
}
