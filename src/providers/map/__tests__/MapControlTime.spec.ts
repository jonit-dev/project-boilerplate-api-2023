import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { MapControlTimeModel } from "@entities/ModuleSystem/MapControlTimeModel";
import { container } from "@providers/inversify/container";
import { AvailableWeather, IControlTime, PeriodOfDay, WeatherSocketEvents } from "@rpg-engine/shared";
import { MapControlTime } from "../MapControlTime";

describe("MapControlTime", () => {
  let mapControlTime: MapControlTime;
  let sendEventToUser: jest.SpyInstance;
  let create: jest.SpyInstance;
  let find: jest.SpyInstance;

  beforeAll(() => {
    mapControlTime = container.get<MapControlTime>(MapControlTime);
  });
  beforeEach(() => {
    // @ts-expect-error
    sendEventToUser = jest.spyOn(mapControlTime.socketMessaging, "sendEventToUser");
    create = jest.spyOn(MapControlTimeModel, "create");
    find = jest.spyOn(Character, "find");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a random weather type", () => {
    const weather = mapControlTime.getRandomWeather();
    expect(weather).toBeDefined();
  });

  it("should control the time and weather for the map", async () => {
    const time = "12:00";
    const periodOfDay = PeriodOfDay.Morning;
    const controlTime = await mapControlTime.controlTime(time, periodOfDay);
    expect(controlTime).toEqual({
      time,
      period: periodOfDay,
      weather: expect.any(String),
    });
  });

  it("should send a time and weather control event to all online characters", async () => {
    // Spy on the `sendEventToUser` method of the SocketMessaging instance
    // @ts-expect-error
    jest.spyOn(mapControlTime.socketMessaging, "sendEventToUser").mockImplementation();

    // Create some mock online characters
    const onlineCharacters = [{ channelId: "channel-1" }, { channelId: "channel-2" }, { channelId: "channel-3" }];

    // Mock the `Character.find` method to return the online characters
    // @ts-expect-error
    jest.spyOn(Character, "find").mockResolvedValue(onlineCharacters);

    // Call the `controlTime` method
    await mapControlTime.controlTime("15:00", PeriodOfDay.Afternoon);

    // Assert that the `sendEventToUser` method was called the correct number of times
    // @ts-expect-error
    expect(mapControlTime.socketMessaging.sendEventToUser).toHaveBeenCalledTimes(onlineCharacters.length);
  });

  it("should return an IControlTime object with the correct time and period of day when the controlTime method is called.", async () => {
    const periodOfDay = PeriodOfDay.Morning;
    // Call the controlTime method with test time and period of day values
    const controlTime: IControlTime = await mapControlTime.controlTime("10:00", periodOfDay);

    // Assert that the returned object has the correct time and period of day values
    expect(controlTime.time).toEqual("10:00");
    expect(controlTime.period).toEqual(periodOfDay);
  });

  it("should return an IControlTime object with a weather property that is either 'Standard' or 'SoftRain'", async () => {
    const periodOfDay = PeriodOfDay.Morning;
    const controlTime = await mapControlTime.controlTime("12:00", periodOfDay);
    expect(controlTime).toEqual({ time: "12:00", period: "Morning", weather: expect.any(String) });
  });

  it("should delete all previous MapControlTimeModel documents when the controlTime method is called.", async () => {
    // Create some dummy MapControlTimeModel documents
    await MapControlTimeModel.create([
      { time: "12:00", period: PeriodOfDay.Morning, weather: "Standard" },
      { time: "18:00", period: PeriodOfDay.Afternoon, weather: "SoftRain" },
      { time: "19:00", period: PeriodOfDay.Afternoon, weather: "Standard" },
    ]);

    // Check that the dummy documents were created
    const countBefore = await MapControlTimeModel.countDocuments({});
    expect(countBefore).toEqual(3);

    // Call the controlTime method
    await mapControlTime.controlTime("15:00", PeriodOfDay.Afternoon);

    // Check that all previous documents have been deleted
    const countAfter = await MapControlTimeModel.countDocuments({});
    expect(countAfter).toEqual(1);
  });

  it("should create a new MapControlTimeModel document with the correct time, period of day, and weather when the controlTime method is called.", async () => {
    create = jest.spyOn(MapControlTimeModel, "create");
    find = jest.spyOn(Character, "find");
    find.mockResolvedValueOnce([]);
    await mapControlTime.controlTime("11:00", PeriodOfDay.Morning);

    expect(create).toHaveBeenCalledWith({ time: "11:00", period: PeriodOfDay.Morning, weather: expect.anything() });
  });
  it("should send a WeatherSocketEvents.TimeWeatherControl event to all online characters with the correct IControlTime data when the controlTime method is called", async () => {
    const onlineCharacters = [{ channelId: "channel-1" }, { channelId: "channel-2" }, { channelId: "channel-3" }];

    // Mock the `Character.find` method to return the online characters
    // @ts-expect-error
    jest.spyOn(Character, "find").mockResolvedValue(onlineCharacters);

    const controlTimeMockData: IControlTime = {
      time: "10:00",
      period: PeriodOfDay.Morning,
      weather: AvailableWeather.Standard,
    };
    jest.spyOn(mapControlTime, "getRandomWeather").mockImplementation(() => AvailableWeather.Standard);

    // Test call
    const result = await mapControlTime.controlTime("10:00", PeriodOfDay.Morning);

    // Assertions
    expect(result).toEqual(controlTimeMockData);
    expect(sendEventToUser).toHaveBeenCalledWith(
      "channel-1",
      WeatherSocketEvents.TimeWeatherControl,
      controlTimeMockData
    );
    expect(sendEventToUser).toHaveBeenCalledWith(
      "channel-2",
      WeatherSocketEvents.TimeWeatherControl,
      controlTimeMockData
    );
    expect(sendEventToUser).toHaveBeenCalledWith(
      "channel-3",
      WeatherSocketEvents.TimeWeatherControl,
      controlTimeMockData
    );
  });
});
