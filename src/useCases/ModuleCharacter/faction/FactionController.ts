import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { DTOValidatorMiddleware } from "@providers/middlewares/DTOValidatorMiddleware";
import { IAuthenticatedRequest } from "@providers/types/ExpressTypes";
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  interfaces,
  request,
  requestBody,
  requestParam,
  queryParam,
} from "inversify-express-utils";
import { ReadFactionRacesUseCase } from "./read/ReadFactionRacesUseCase";
import { ReadSpriteUseCase } from "./read/ReadSpriteUseCase";

@controller("/factions", AuthMiddleware)
export class FactionController implements interfaces.Controller {
  constructor(private readFactionRacesUseCase: ReadFactionRacesUseCase, private readSpriteUseCase: ReadSpriteUseCase) {}

  @httpGet("/races")
  private getFactionRaces(@queryParam("faction") faction: string): string[] {
    return this.readFactionRacesUseCase.readAll(faction);
  }

  @httpGet("/sprites")
  private async getSprites(
    @queryParam("faction") faction: string,
    @queryParam("race") race: string
  ): Promise<string[]> {
    return await this.readSpriteUseCase.readAll(faction, race);
  }
}
