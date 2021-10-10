import { controller, httpGet, interfaces, request, requestParam } from "inversify-express-utils";

import { ReadPlaceUseCase } from "./read/ReadPlaceUseCase";

@controller("/places")
export class PlacesController implements interfaces.Controller {
  constructor(private readPlaceUseCase: ReadPlaceUseCase) {}

  @httpGet("/countries")
  public countries(@request() req): Promise<any> {
    return this.readPlaceUseCase.readCountries();
  }

  @httpGet("/:country/cities")
  public cities(@requestParam() params): Promise<any> {
    const { country } = params;

    return this.readPlaceUseCase.readCities(country);
  }
}
