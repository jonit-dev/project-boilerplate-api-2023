import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { appEnv } from "@providers/config/env";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { PM2Helper } from "@providers/server/PM2Helper";
import { EnvType } from "@rpg-engine/shared";

type CharacterMonitorCallback = (character: ICharacter) => void;

@provideSingleton(CharacterMonitor)
export class CharacterMonitor {
  private charactersCallbacks = new Map<string, CharacterMonitorCallback>();
  private monitorIntervalMS: number;

  constructor(private pm2Helper: PM2Helper) {}

  public monitor(intervalMs?: number): void {
    this.monitorIntervalMS = intervalMs || 3000;

    this.clear(); // clear our state in redis before beginning

    if (appEnv.general.ENV === EnvType.Production && process.env.pm_id === this.pm2Helper.pickLastCPUInstance()) {
      // in prod, only use one instance for this.
      this.execCallbacks();
    } else {
      // in dev, just monitor
      this.execCallbacks();
    }
  }

  public watch(character: ICharacter, callback: CharacterMonitorCallback): void {
    this.charactersCallbacks.set(String(character._id), callback);
  }

  public unwatch(character: ICharacter): void {
    this.charactersCallbacks.delete(character._id);
  }

  public clear(): void {
    this.charactersCallbacks.clear();
  }

  private execCallbacks(): void {
    setInterval(async () => {
      const characterIds = this.charactersCallbacks.keys();

      for (const characterId of characterIds) {
        // execute character callback
        const callback = this.charactersCallbacks.get(characterId);

        if (callback) {
          const character = (await Character.findOne({ _id: characterId }).lean()) as ICharacter;
          callback(character);
        }
      }
    }, this.monitorIntervalMS);
  }
}
