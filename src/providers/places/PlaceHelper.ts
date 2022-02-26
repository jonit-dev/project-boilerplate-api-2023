import countries from "@data/countries.json";
import { NotFoundError } from "@providers/errors/NotFoundError";
import { ICountry } from "@rpg-engine/shared/dist";
import * as Places from "countries-cities";
import { provide } from "inversify-binding-decorators";

@provide(PlaceHelper)
export class PlaceHelper {
  public getCountry(countryCode: string): ICountry | undefined {
    const country = countries.find((c: ICountry) => c.code === countryCode);

    if (!country) {
      throw new NotFoundError(`Country not found for country code '${countryCode}'`);
    }

    return country;
  }

  public getCountries(): ICountry[] {
    return countries;
  }

  public getCities(country: string): string[] {
    const cities = Places.getCities(country);

    if (!cities) {
      throw new NotFoundError(`Cities not found for country '${country}'`);
    }

    return cities;
  }
}
