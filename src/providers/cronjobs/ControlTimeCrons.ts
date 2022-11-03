import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";
import { MapControlTime } from "../map/MapControlTime";

import { PeriodOfDay, WEATHER_OF_DAY } from "../../providers/map/types/ControlTimeTypes";

@provide(ControlTimeCrons)
export class ControlTimeCrons {
  constructor(private mapControlTime: MapControlTime) {}

  public schedule(): void {
    /*
    For porpose of testing we will keep this part of code commented,
    uncomment and the control time will send one event per minute.
    */

    // nodeCron.schedule("* * * * *", async () => {
    //   await this.mapControlTime.controlTime(
    //     "06:00",
    //     PeriodOfDay.Morning,
    //     this.mapControlTime.getRandomWeather(WEATHER_OF_DAY)
    //   );
    // });

    // Day One
    // Morning 6:00
    nodeCron.schedule("0 6 * * *", async () => {
      await this.mapControlTime.controlTime(
        "06:00",
        PeriodOfDay.Morning,
        this.mapControlTime.getRandomWeather(WEATHER_OF_DAY)
      );
    });

    //   // Afternoon 13:00
    nodeCron.schedule("0 9 * * *", async () => {
      await this.mapControlTime.controlTime("13:00", PeriodOfDay.Afternoon, WEATHER_OF_DAY[2]);
    });

    // Night 19:00
    nodeCron.schedule("* 12 * * *", async () => {
      await this.mapControlTime.controlTime("19:00", PeriodOfDay.Night, WEATHER_OF_DAY[0]);
    });

    // Day Two
    // Morning 6:00
    nodeCron.schedule("* 16 * * *", async () => {
      await this.mapControlTime.controlTime("06:00", PeriodOfDay.Morning, WEATHER_OF_DAY[2]);
    });

    // Afternoon 13:00
    nodeCron.schedule("* 19 * * *", async () => {
      await this.mapControlTime.controlTime("13:00", PeriodOfDay.Afternoon, WEATHER_OF_DAY[1]);
    });

    // Night 19:00
    nodeCron.schedule("* 22 * * *", async () => {
      await this.mapControlTime.controlTime("19:00", PeriodOfDay.Night, WEATHER_OF_DAY[0]);
    });

    // Day Three
    // Morning 6:00
    nodeCron.schedule("* 1 * * *", async () => {
      await this.mapControlTime.controlTime("06:00", PeriodOfDay.Morning, WEATHER_OF_DAY[0]);
    });

    // Afternoon 13:00
    nodeCron.schedule("* 4 * * *", async () => {
      await this.mapControlTime.controlTime("13:00", PeriodOfDay.Afternoon, WEATHER_OF_DAY[0]);
    });

    // Night 19:00
    nodeCron.schedule("* 7 * * *", async () => {
      await this.mapControlTime.controlTime(
        "19:00",
        PeriodOfDay.Night,
        this.mapControlTime.getRandomWeather(WEATHER_OF_DAY)
      );
    });
  }
}
