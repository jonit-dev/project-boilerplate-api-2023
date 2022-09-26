export class ItemUseCycle {
  constructor(fn: Function, intervals: number, intervalDurationSec: number) {
    this.execute(fn, intervals, intervalDurationSec);
  }

  private async execute(fn: Function, intervals: number, intervalDurationSec: number): Promise<void> {
    await fn();

    intervals--;
    if (intervals > 0) {
      setTimeout(() => {
        this.execute(fn, intervals, intervalDurationSec);
      }, intervalDurationSec * 1000);
    }
  }
}
