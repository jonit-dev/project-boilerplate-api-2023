export class ItemUseCycle {
  constructor(fn: Function, iterations: number) {
    this.execute(fn, iterations);
  }

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
