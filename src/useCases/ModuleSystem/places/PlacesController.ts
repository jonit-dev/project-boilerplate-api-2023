import { cache } from "@providers/constants/CacheConstants";
import { ICountry, ICountryCity } from "@rpg-engine/shared/dist";
import { controller, httpGet, interfaces, requestParam } from "inversify-express-utils";
import { ReadPlaceUseCase } from "./read/ReadPlaceUseCase";

@controller("/places", cache("24 hours"))
export class PlacesController implements interfaces.Controller {
  constructor(private readPlaceUseCase: ReadPlaceUseCase) {}

  @httpGet("/country/:code")
  public country(@requestParam() params): ICountryCity {
    const { code } = params;

    return this.readPlaceUseCase.readCountry(code);
  }

  @httpGet("/countries")
  public countries(): ICountry[] {
    return this.readPlaceUseCase.readCountries();
  }

  @httpGet("/:countryNameOrCode/cities")
  public cities(@requestParam() params): string[] {
    const { countryNameOrCode } = params;

    return this.readPlaceUseCase.readCities(countryNameOrCode);
  }
}
