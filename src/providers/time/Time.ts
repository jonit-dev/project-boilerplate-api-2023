import { provide } from "inversify-binding-decorators";

@provide(Time)
export class Time {
  async waitForSeconds(seconds: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}
