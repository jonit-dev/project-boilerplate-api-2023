import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { MapControlTimeModel } from "@entities/ModuleSystem/MapControlTimeModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { AvailableWeather, IControlTime, PeriodOfDay, WeatherSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import random from "lodash/random";

@provide(MapControlTime)
export class MapControlTime {
  constructor(private socketMessaging: SocketMessaging) {}

  public getRandomWeather(): AvailableWeather {
    const n = random(0, 100);

    if (n < 80) {
      return AvailableWeather.Standard;
    } else {
      return AvailableWeather.SoftRain;
    }
  }

  public async controlTime(time: string, periodOfDay: PeriodOfDay): Promise<IControlTime> {
    // TODO: Refactor to use repository later
    const onlineCharacters = await Character.find({ isOnline: true });

    const dataOfWeather: IControlTime = {
      time: time,
      period: periodOfDay,
      weather: this.getRandomWeather(),
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
