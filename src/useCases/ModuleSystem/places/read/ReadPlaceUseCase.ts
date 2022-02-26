import { NotFoundError } from "@providers/errors/NotFoundError";
import { PlaceHelper } from "@providers/places/PlaceHelper";
import { ICountry, ICountryCity } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ReadPlaceUseCase)
export class ReadPlaceUseCase {
  constructor(private placeHelper: PlaceHelper) {}

  public readCountries(): ICountry[] {
    return this.placeHelper.getCountries();
  }

  public readCities(countryNameOrCode: string): string[] {
    if (countryNameOrCode.length === 2) {
      // it's a country code
      return this.readCitiesByCountryCode(countryNameOrCode);
    }

    return this.readCitiesByCountryName(countryNameOrCode);
  }

  public readCountry(countryCode: string): ICountryCity {
    const country = this.placeHelper.getCountry(countryCode);

    if (!country) {
      throw new NotFoundError("Country not found");
    }
    const cities = this.placeHelper.getCities(country.name);

    if (!cities) {
      throw new NotFoundError(`Error: We couldn't cities associated with the country ${country.name}`);
    }

    return {
      country,
      cities,
    };
  }

  private readCitiesByCountryName(countryName: string): string[] {
    return this.placeHelper.getCities(countryName);
  }

  private readCitiesByCountryCode(countryCode: string): string[] {
    const country = this.placeHelper.getCountry(countryCode);

    if (!country) {
      throw new NotFoundError("Country not found");
    }

    return this.placeHelper.getCities(country.name);
  }
}
