import { IControlTime } from "@entities/ModuleSystem/MapControlTimeModel";
import { unitTestHelper } from "@providers/inversify/container";
import { PeriodOfDay } from "@providers/map/types/ControlTimeTypes";

describe("MapControlTimeModel.ts", () => {
  let testWeather: IControlTime;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    await unitTestHelper.createWeatherControlMock("06:00", PeriodOfDay.Morning, "Standard", new Date());
  });

  it("Validate if the record is being created", () => {
    const controlTime = {
      time: "06:00",
      period: PeriodOfDay.Morning,
      weather: "Standard",
      createdAt: new Date(),
    };

    expect(controlTime.time).toEqual(testWeather.time);
    expect(controlTime.period).toEqual(testWeather.period);
    expect(controlTime.weather).toEqual(testWeather.weather);
    expect(controlTime.createdAt).toEqual(testWeather.createdAt);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
