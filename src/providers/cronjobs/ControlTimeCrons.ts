import { NewRelic } from "@providers/analytics/NewRelic";
import { PeriodOfDay } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MapControlTime } from "../map/MapControlTime";
import { CronJobScheduler } from "./CronJobScheduler";

@provide(ControlTimeCrons)
export class ControlTimeCrons {
  constructor(
    private mapControlTime: MapControlTime,
    private newRelic: NewRelic,
    private cronJobScheduler: CronJobScheduler
  ) {}

  private async controlTimeTask(time: string, period: PeriodOfDay): Promise<void> {
    await this.mapControlTime.controlTime(time, period);
  }

  public schedule(): void {
    // For testing purposes, we will keep this part of code commented,
    // uncomment and the control time will send one event per minute.
    // nodeCron.schedule("* * * * *", async () => {
    //   await this.mapControlTime.controlTime("06:00", PeriodOfDay.Morning);
    // });

    const schedules = [
      { cron: "0 6 * * *", time: "06:00", period: PeriodOfDay.Morning },
      { cron: "0 9 * * *", time: "13:00", period: PeriodOfDay.Afternoon },
      { cron: "* 12 * * *", time: "19:00", period: PeriodOfDay.Night },
      { cron: "* 16 * * *", time: "06:00", period: PeriodOfDay.Morning },
      { cron: "* 19 * * *", time: "13:00", period: PeriodOfDay.Afternoon },
      { cron: "* 22 * * *", time: "19:00", period: PeriodOfDay.Night },
      { cron: "* 1 * * *", time: "06:00", period: PeriodOfDay.Morning },
      { cron: "* 4 * * *", time: "13:00", period: PeriodOfDay.Afternoon },
      { cron: "* 7 * * *", time: "19:00", period: PeriodOfDay.Night },
    ];

    for (const schedule of schedules) {
      this.cronJobScheduler.uniqueSchedule(`control-time-cron-${schedule.time}`, schedule.cron, async () => {
        await this.controlTimeTask(schedule.time, schedule.period);
      });
    }
  }
}
