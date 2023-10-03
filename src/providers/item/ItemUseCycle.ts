import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";

/* eslint-disable @typescript-eslint/no-floating-promises */
export class ItemUseCycle {
  constructor(fn: Function, iterations: number) {
    this.execute(fn, iterations);
  }

  @TrackNewRelicTransaction()
  private async execute(fn: Function, iterations: number): Promise<void> {
    await fn();

    iterations--;
    if (iterations > 0) {
      const intervalDurationSec = 10;

      setTimeout(() => {
        this.execute(fn, iterations);
      }, intervalDurationSec * 1000);
    }
  }
}
