import { PeriodOfDay } from "@rpg-engine/shared";

import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";
import { MapControlTime } from "../map/MapControlTime";

@provide(ControlTimeCrons)
export class ControlTimeCrons {
  constructor(private mapControlTime: MapControlTime) {}

  public schedule(): void {
    /*
    For purpose of testing we will keep this part of code commented,
    uncomment and the control time will send one event per minute.
    */

    // nodeCron.schedule("* * * * *", async () => {
    //   await this.mapControlTime.controlTime("06:00", PeriodOfDay.Morning);
    // });

    // Day One
    // Morning 6:00
    nodeCron.schedule("0 6 * * *", async () => {
      console.log("🕒 Control Time Cron: Morning 6:00");

      await this.mapControlTime.controlTime("06:00", PeriodOfDay.Morning);
    });

    //   // Afternoon 13:00
    nodeCron.schedule("0 9 * * *", async () => {
      console.log("🕒 Control Time Cron: Afternoon 13:00");
      await this.mapControlTime.controlTime("13:00", PeriodOfDay.Afternoon);
    });

    // Night 19:00
    nodeCron.schedule("* 12 * * *", async () => {
      console.log("🕒 Control Time Cron: Night 19:00");
      await this.mapControlTime.controlTime("19:00", PeriodOfDay.Night);
    });

    // Day Two
    // Morning 6:00
    nodeCron.schedule("* 16 * * *", async () => {
      console.log("🕒 Control Time Cron: Morning 6:00");

      await this.mapControlTime.controlTime("06:00", PeriodOfDay.Morning);
    });

    // Afternoon 13:00
    nodeCron.schedule("* 19 * * *", async () => {
      console.log("🕒 Control Time Cron: Afternoon 13:00");

      await this.mapControlTime.controlTime("13:00", PeriodOfDay.Afternoon);
    });

    // Night 19:00
    nodeCron.schedule("* 22 * * *", async () => {
      console.log("🕒 Control Time Cron: Night 19:00");
      await this.mapControlTime.controlTime("19:00", PeriodOfDay.Night);
    });

    // Day Three
    // Morning 6:00
    nodeCron.schedule("* 1 * * *", async () => {
      console.log("🕒 Control Time Cron: Morning 6:00");
      await this.mapControlTime.controlTime("06:00", PeriodOfDay.Morning);
    });

    // Afternoon 13:00
    nodeCron.schedule("* 4 * * *", async () => {
      console.log("🕒 Control Time Cron: Afternoon 13:00");
      await this.mapControlTime.controlTime("13:00", PeriodOfDay.Afternoon);
    });

    // Night 19:00
    nodeCron.schedule("* 7 * * *", async () => {
      console.log("🕒 Control Time Cron: Night 19:00");
      await this.mapControlTime.controlTime("19:00", PeriodOfDay.Night);
    });
  }
}
