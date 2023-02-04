import { IControlTime } from "@entities/ModuleSystem/MapControlTimeModel";
import { unitTestHelper } from "@providers/inversify/container";
import { PeriodOfDay } from "@rpg-engine/shared";

describe("MapControlTimeModel.ts", () => {
  let testWeather: IControlTime;

  beforeEach(async () => {
    testWeather = await unitTestHelper.createWeatherControlMock("06:00", PeriodOfDay.Morning, "Standard");
  });

  it("Validate if the record is being created", () => {
    const controlTime = {
      time: "06:00",
      period: PeriodOfDay.Morning,
      weather: "Standard",
    };

    expect(controlTime.time).toEqual(testWeather.time);
    expect(controlTime.period).toEqual(testWeather.period);
    expect(controlTime.weather).toEqual(testWeather.weather);
  });
});
