import { ICharacterTexture } from "@entities/ModuleCharacter/CharacterTextureModel";
import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { controller, httpGet, interfaces, queryParam } from "inversify-express-utils";
import { cache } from "@providers/constants/CacheConstants";
import { ReadFactionRacesUseCase } from "./read/ReadFactionRacesUseCase";
import { ReadSpriteUseCase } from "./read/ReadSpriteUseCase";

@controller("/factions", AuthMiddleware)
export class FactionController implements interfaces.Controller {
  constructor(private readFactionRacesUseCase: ReadFactionRacesUseCase, private readSpriteUseCase: ReadSpriteUseCase) {}

  @httpGet("/races", cache("24 hours"))
  private getFactionRaces(@queryParam("faction") faction: string): string[] {
    return this.readFactionRacesUseCase.readAll(faction);
  }

  @httpGet("/sprites", cache("24 hours"))
  private async getSprites(
    @queryParam("faction") faction: string,
    @queryParam("race") race: string
  ): Promise<ICharacterTexture[]> {
    return await this.readSpriteUseCase.readAll(faction, race);
  }
}
