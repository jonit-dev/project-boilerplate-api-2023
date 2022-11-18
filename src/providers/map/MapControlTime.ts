import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { MapControlTimeModel } from "@entities/ModuleSystem/MapControlTimeModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { AvailableWeather, IControlTime, PeriodOfDay, TypeHelper, WeatherSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(MapControlTime)
export class MapControlTime {
  constructor(private socketMessaging: SocketMessaging) {}

  public getRandomWeather(): AvailableWeather {
    const length = TypeHelper.enumToStringArray(AvailableWeather).length;
    const randomWeather = Math.floor(Math.random() * length);

    let weather = AvailableWeather.Standard;
    switch (randomWeather) {
      case 1:
        weather = AvailableWeather.SoftRain;
        break;
      case 2:
        weather = AvailableWeather.HeavyRain;
        break;
      case 3:
        weather = AvailableWeather.Snowing;
        break;
    }
    return weather;
  }

  public async controlTime(
    time: string,
    periodOfDay: PeriodOfDay,
    weatherOfDay: AvailableWeather
  ): Promise<IControlTime> {
    const onlineCharacters = await Character.find({ isOnline: true });

    const dataOfWeather: IControlTime = {
      time: time,
      period: periodOfDay,
      weather: weatherOfDay,
    };

    // Delete old registry
    await MapControlTimeModel.deleteMany();

    // Create new one
    await MapControlTimeModel.create(dataOfWeather);

    for (const character of onlineCharacters) {
      this.socketMessaging.sendEventToUser<IControlTime>(
        character.channelId!,
        WeatherSocketEvents.TimeWeatherControl,
        dataOfWeather
      );
    }

    return dataOfWeather;
  }
}
