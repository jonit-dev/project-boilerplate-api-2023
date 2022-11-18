import { PeriodOfDay, AvailableWeather, TypeHelper } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";
import { MapControlTime } from "../map/MapControlTime";

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
      await this.mapControlTime.controlTime("06:00", PeriodOfDay.Morning, this.mapControlTime.getRandomWeather());
    });

    //   // Afternoon 13:00
    nodeCron.schedule("0 9 * * *", async () => {
      await this.mapControlTime.controlTime("13:00", PeriodOfDay.Afternoon, AvailableWeather.SoftRain);
    });

    // Night 19:00
    nodeCron.schedule("* 12 * * *", async () => {
      await this.mapControlTime.controlTime("19:00", PeriodOfDay.Night, AvailableWeather.Standard);
    });

    // Day Two
    // Morning 6:00
    nodeCron.schedule("* 16 * * *", async () => {
      await this.mapControlTime.controlTime("06:00", PeriodOfDay.Morning, AvailableWeather.SoftRain);
    });

    // Afternoon 13:00
    nodeCron.schedule("* 19 * * *", async () => {
      await this.mapControlTime.controlTime("13:00", PeriodOfDay.Afternoon, AvailableWeather.HeavyRain);
    });

    // Night 19:00
    nodeCron.schedule("* 22 * * *", async () => {
      await this.mapControlTime.controlTime("19:00", PeriodOfDay.Night, AvailableWeather.Standard);
    });

    // Day Three
    // Morning 6:00
    nodeCron.schedule("* 1 * * *", async () => {
      await this.mapControlTime.controlTime("06:00", PeriodOfDay.Morning, AvailableWeather.Standard);
    });

    // Afternoon 13:00
    nodeCron.schedule("* 4 * * *", async () => {
      await this.mapControlTime.controlTime("13:00", PeriodOfDay.Afternoon, AvailableWeather.Standard);
    });

    // Night 19:00
    nodeCron.schedule("* 7 * * *", async () => {
      await this.mapControlTime.controlTime("19:00", PeriodOfDay.Night, this.mapControlTime.getRandomWeather());
    });
  }
}
