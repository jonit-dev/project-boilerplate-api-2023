type SetInterval = ReturnType<typeof setInterval>;

export class EntityBehavioralLoop {
  public interval: SetInterval;

  constructor(fn: Function, intervalSpeed: number) {
    this.interval = setInterval(() => {
      fn();
    }, intervalSpeed);
  }

  public clear(): void {
    clearInterval(this.interval);
  }
}
