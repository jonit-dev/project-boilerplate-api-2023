import { ICountry, ICountryCity } from "@project-remote-job-board/shared/dist";
import { controller, httpGet, interfaces, request, requestParam } from "inversify-express-utils";

import { ReadPlaceUseCase } from "./read/ReadPlaceUseCase";

@controller("/places")
export class PlacesController implements interfaces.Controller {
  constructor(private readPlaceUseCase: ReadPlaceUseCase) {}

  @httpGet("/country/:code")
  public country(@requestParam() params): ICountryCity {
    const { code } = params;

    return this.readPlaceUseCase.readCountry(code);
  }

  @httpGet("/countries")
  public countries(@request() req): ICountry[] {
    return this.readPlaceUseCase.readCountries();
  }

  @httpGet("/:country/cities")
  public cities(@requestParam() params): Promise<string[]> {
    const { country } = params;

    if (country.length === 2) {
      // it's a country code
      return this.readPlaceUseCase.readCities(null, country);
    }

    return this.readPlaceUseCase.readCities(country);
  }
}
