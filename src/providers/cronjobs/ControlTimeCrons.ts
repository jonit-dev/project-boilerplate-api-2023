import { PeriodOfDay } from "@rpg-engine/shared";

import { NewRelic } from "@providers/analytics/NewRelic";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";
import { MapControlTime } from "../map/MapControlTime";

@provide(ControlTimeCrons)
export class ControlTimeCrons {
  constructor(private mapControlTime: MapControlTime, private newRelic: NewRelic) {}

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
    nodeCron.schedule("0 6 * * *", () => {
      this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "ControlTimeCrons/6:00", async () => {
        await this.mapControlTime.controlTime("06:00", PeriodOfDay.Morning);
      });
    });

    //   // Afternoon 13:00
    nodeCron.schedule("0 9 * * *", () => {
      this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "ControlTimeCrons/13:00", async () => {
        await this.mapControlTime.controlTime("13:00", PeriodOfDay.Afternoon);
      });
    });

    // Night 19:00
    nodeCron.schedule("* 12 * * *", () => {
      this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "ControlTimeCrons/19:00", async () => {
        await this.mapControlTime.controlTime("19:00", PeriodOfDay.Night);
      });
    });

    // Day Two
    // Morning 6:00
    nodeCron.schedule("* 16 * * *", () => {
      this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "ControlTimeCrons/06:00", async () => {
        await this.mapControlTime.controlTime("06:00", PeriodOfDay.Morning);
      });
    });

    // Afternoon 13:00
    nodeCron.schedule("* 19 * * *", () => {
      this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "ControlTimeCrons/13:00", async () => {
        await this.mapControlTime.controlTime("13:00", PeriodOfDay.Afternoon);
      });
    });

    // Night 19:00
    nodeCron.schedule("* 22 * * *", () => {
      this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "ControlTimeCrons/19:00", async () => {
        await this.mapControlTime.controlTime("19:00", PeriodOfDay.Night);
      });
    });

    // Day Three
    // Morning 6:00
    nodeCron.schedule("* 1 * * *", () => {
      this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "ControlTimeCrons/06:00", async () => {
        await this.mapControlTime.controlTime("06:00", PeriodOfDay.Morning);
      });
    });

    // Afternoon 13:00
    nodeCron.schedule("* 4 * * *", () => {
      this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "ControlTimeCrons/13:00", async () => {
        await this.mapControlTime.controlTime("13:00", PeriodOfDay.Afternoon);
      });
    });

    // Night 19:00
    nodeCron.schedule("* 7 * * *", () => {
      this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "ControlTimeCrons/19:00", async () => {
        await this.mapControlTime.controlTime("19:00", PeriodOfDay.Night);
      });
    });
  }
}
