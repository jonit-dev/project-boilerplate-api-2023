import countries from "@data/countries.json";
import { ICountry } from "@project-remote-job-board/shared/dist";
import * as Places from "countries-cities";
import { provide } from "inversify-binding-decorators";

@provide(PlaceHelper)
export class PlaceHelper {
  public getCountry(countryCode: string): ICountry | undefined {
    return countries.find((c: ICountry) => c.code === countryCode);
  }

  public getCountries(): ICountry[] {
    return countries;
  }

  public getCities(country: string): string[] {
    return Places.getCities(country);
  }
}
