type SetInterval = ReturnType<typeof setInterval>;

export class CharacterBattleCycle {
  public interval: SetInterval;

  constructor(fn: Function, attackIntervalSpeed: number) {
    this.interval = setInterval(() => {
      fn();
    }, attackIntervalSpeed);
  }

  public clear(): void {
    clearInterval(this.interval);
  }
}
