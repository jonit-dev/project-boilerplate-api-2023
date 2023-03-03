import { ICharacterTexture } from "@entities/ModuleCharacter/CharacterTextureModel";
import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { controller, httpGet, interfaces, queryParam } from "inversify-express-utils";
import { ReadFactionRacesUseCase } from "./read/ReadFactionRacesUseCase";
import { ReadSpriteUseCase } from "./read/ReadSpriteUseCase";
import { TypeHelper, CharacterClass } from "@rpg-engine/shared";

@controller("/factions", AuthMiddleware)
export class FactionController implements interfaces.Controller {
  constructor(private readFactionRacesUseCase: ReadFactionRacesUseCase, private readSpriteUseCase: ReadSpriteUseCase) {}

  @httpGet("/classes")
  private getFactionClasses(): string[] {
    return TypeHelper.enumToStringArray(CharacterClass);
  }

  @httpGet("/races")
  private getFactionRaces(@queryParam("faction") faction: string): string[] {
    return this.readFactionRacesUseCase.readAll(faction);
  }

  @httpGet("/sprites")
  private async getSprites(
    @queryParam("faction") faction: string,
    @queryParam("race") race: string
  ): Promise<ICharacterTexture[]> {
    return await this.readSpriteUseCase.readAll(faction, race);
  }
}
