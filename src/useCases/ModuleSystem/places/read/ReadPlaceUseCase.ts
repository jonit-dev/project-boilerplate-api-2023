import { ICountry, ICountryCity } from "@project-remote-job-board/shared/dist";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { NotFoundError } from "@providers/errors/NotFoundError";
import { PlaceHelper } from "@providers/places/PlaceHelper";
import { provide } from "inversify-binding-decorators";

@provide(ReadPlaceUseCase)
export class ReadPlaceUseCase {
  constructor(private placeHelper: PlaceHelper) {}

  public readCountries(): ICountry[] {
    return this.placeHelper.getCountries();
  }

  public readCities(country?: string | null, countryCode?: string): any {
    if (!country && !countryCode) {
      throw new BadRequestError("You must provide a country or a country code.");
    }

    if (country) {
      return this.placeHelper.getCities(country);
    }
    if (countryCode) {
      const country = this.placeHelper.getCountry(countryCode);

      if (!country) {
        throw new NotFoundError("Country not found");
      }

      return this.placeHelper.getCities(country.name);
    }
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
}
