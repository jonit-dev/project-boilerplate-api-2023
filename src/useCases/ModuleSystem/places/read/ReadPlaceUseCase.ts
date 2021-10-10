import * as Places from "countries-cities";
import { provide } from "inversify-binding-decorators";

@provide(ReadPlaceUseCase)
export class ReadPlaceUseCase {
  public readCountries(): Promise<any> {
    return Places.getCountries();
  }

  public readCities(country: string): Promise<any> {
    return Places.getCities(country);
  }
}
