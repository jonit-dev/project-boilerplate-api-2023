import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { MapControlTimeModel } from "@entities/ModuleSystem/MapControlTimeModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";
import { IControlTime, WeatherSocketEvents } from "../../providers/map/types/ControlTimeTypes";

@provide(MapControlTime)
export class MapControlTime {
  constructor(private socketMessaging: SocketMessaging) {}

  public getRandomWeather(weatherOfDay: string[]): string {
    const randomWeather = Math.floor(Math.random() * weatherOfDay.length);

    return weatherOfDay[randomWeather];
  }

  public async controlTime(time: string, periodOfDay: string, weatherOfDay: string): Promise<IControlTime> {
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
