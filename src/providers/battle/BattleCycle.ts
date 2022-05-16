import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { BattleCharacterManager } from "@providers/battle/BattleCharacterManager";

type SetInterval = ReturnType<typeof setInterval>;

export class BattleCycle {
  public interval: SetInterval;
  public id: string;

  constructor(id: string, fn: Function, intervalSpeed: number) {
    this.id = id;
    this.interval = setInterval(() => {
      fn();
    }, intervalSpeed);

    if (BattleCharacterManager.battleCycles.has(this.id)) {
      const battleCycle = BattleCharacterManager.battleCycles.get(this.id);
      if (battleCycle) {
        battleCycle.clear();
      }
    } else {
      BattleCharacterManager.battleCycles.set(this.id, this);
    }
  }

  public async clear(): Promise<void> {
    clearInterval(this.interval);
    BattleCharacterManager.battleCycles.delete(this.id);

    await Character.updateOne({ _id: this.id }, { $unset: { target: 1 } });
  }
}
