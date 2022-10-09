import { Character } from "@entities/ModuleCharacter/CharacterModel";

type SetInterval = ReturnType<typeof setInterval>;

export class BattleCycle {
  public static battleCycles: Map<string, BattleCycle> = new Map<string, BattleCycle>(); // create a map to store character intervals.

  public interval: SetInterval;
  public id: string;

  constructor(id: string, fn: Function, intervalSpeed: number) {
    this.id = id;
    this.interval = setInterval(() => {
      fn();
    }, intervalSpeed);

    if (BattleCycle.battleCycles.has(this.id)) {
      const battleCycle = BattleCycle.battleCycles.get(this.id);
      if (battleCycle) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        battleCycle.clear();
      }
    } else {
      BattleCycle.battleCycles.set(this.id, this);
    }
  }

  public async clear(): Promise<void> {
    clearInterval(this.interval);
    BattleCycle.battleCycles.delete(this.id);

    await Character.updateOne({ _id: this.id }, { $unset: { target: 1 } });
  }
}
