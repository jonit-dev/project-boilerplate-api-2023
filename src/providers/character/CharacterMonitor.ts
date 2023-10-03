import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { appEnv } from "@providers/config/env";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { PM2Helper } from "@providers/server/PM2Helper";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { EnvType } from "@rpg-engine/shared";

type CharacterMonitorCallback = (character: ICharacter) => void;

@provideSingleton(CharacterMonitor)
export class CharacterMonitor {
  private charactersCallbacks = new Map<string, CharacterMonitorCallback>();
  private monitorIntervalMS: number;

  constructor(private pm2Helper: PM2Helper, private newRelic: NewRelic) {}

  @TrackNewRelicTransaction()
  public async monitor(intervalMs?: number): Promise<void> {
    this.monitorIntervalMS = intervalMs || 3000;
    this.clear(); // clear our state in redis before beginning

    if (appEnv.general.ENV === EnvType.Production && process.env.pm_id === this.pm2Helper.pickLastCPUInstance()) {
      // in prod, only use one instance for this.
      await this.execCallbacks();
    } else {
      // in dev, just monitor
      await this.execCallbacks();
    }
  }

  public watch(character: ICharacter, callback: CharacterMonitorCallback): void {
    // clear out previous callbacks
    if (this.charactersCallbacks.has(String(character._id))) {
      this.charactersCallbacks.delete(String(character._id));
    }

    this.charactersCallbacks.set(String(character._id), callback);
  }

  public unwatch(character: ICharacter): void {
    this.charactersCallbacks.delete(character._id);
  }

  public clear(): void {
    this.charactersCallbacks.clear();
  }

  private async fetchAndExecuteCallback(characterId: string): Promise<void> {
    // execute character callback
    const callback = this.charactersCallbacks.get(characterId);

    if (callback) {
      const character = (await Character.findOne({ _id: characterId }).lean({
        virtuals: true,
        defaults: true,
      })) as ICharacter;

      if (!character || !character.isAlive || character.isBanned || !character.isOnline) {
        this.charactersCallbacks.delete(characterId);
      } else {
        callback(character);
      }
    }
  }

  private async execCallbacks(): Promise<void> {
    const characterIds = [...this.charactersCallbacks.keys()];
    await this.newRelic.trackTransaction(NewRelicTransactionCategory.Interval, "CharacterMonitor", async () => {
      // Create an array of promises and execute them concurrently
      await Promise.all(characterIds.map((characterId) => this.fetchAndExecuteCallback(characterId)));
    });

    // Ensure next execution does not overlap with current one by using setTimeout instead of setInterval
    setTimeout(() => this.execCallbacks(), this.monitorIntervalMS);
  }
}
