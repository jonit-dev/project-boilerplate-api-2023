export enum PeriodOfDay {
  Morning = "Morning",
  Afternoon = "Afternoon",
  Night = "Night",
}

export const WEATHER_OF_DAY = ["Standard", "Raining", "Clouding"];

export interface IControlTime {
  time: string;
  period: string;
  weather: string;
}

export enum WeatherSocketEvents {
  TimeWeatherControl = "TimeWeatherControl",
}
