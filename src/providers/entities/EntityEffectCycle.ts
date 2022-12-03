/* eslint-disable @typescript-eslint/no-floating-promises */
export class EntityEffectCycle {
  constructor(fn: Function, iterations: number, totalDurationMs?: number) {
    this.execute(fn, iterations, totalDurationMs);
  }

  private async execute(fn: Function, iterations: number, totalDurationMs?: number): Promise<void> {
    await fn();
    let duration = totalDurationMs || iterations * 1000;

    iterations--;
    duration -= 1000;
    if (iterations > 0 && duration > 0) {
      const intervalDurationSec = 1;

      setTimeout(() => {
        this.execute(fn, iterations);
      }, intervalDurationSec * 1000);
    }
  }
}
