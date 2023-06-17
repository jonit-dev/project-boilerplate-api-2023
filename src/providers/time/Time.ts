import { appEnv } from "@providers/config/env";
import { provide } from "inversify-binding-decorators";

@provide(Time)
export class Time {
  async waitForSeconds(seconds: number): Promise<void> {
    if (appEnv.general.IS_UNIT_TEST) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  async waitForMilliseconds(milliseconds: number): Promise<void> {
    if (appEnv.general.IS_UNIT_TEST) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}
