import { ICharacterTexture } from "@entities/ModuleCharacter/CharacterTextureModel";
import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { controller, httpGet, interfaces, queryParam } from "inversify-express-utils";
import { ReadFactionRacesUseCase } from "./read/ReadFactionRacesUseCase";
import { ReadSpriteUseCase } from "./read/ReadSpriteUseCase";
import { ReadCharacterClass } from "./read/ReadCharacterClass";
import { CharacterClass } from "@rpg-engine/shared";

@controller("/factions", AuthMiddleware)
export class FactionController implements interfaces.Controller {
  constructor(private readFactionRacesUseCase: ReadFactionRacesUseCase, private readSpriteUseCase: ReadSpriteUseCase) {}

  @httpGet("/classes")
  private getFactionClasses(): string[] {
    return ReadCharacterClass.getPlayingCharacterClasses();
  }

  @httpGet("/races")
  private getFactionRaces(@queryParam("faction") faction: string): string[] {
    return this.readFactionRacesUseCase.readAll(faction);
  }

  @httpGet("/sprites")
  private async getSprites(
    @queryParam("class") clas: string,
    @queryParam("race") race: string
  ): Promise<ICharacterTexture[]> {
    let results = await this.readSpriteUseCase.readAll(clas || CharacterClass.None, race);
    if (results.length < 1) {
      results = await this.readSpriteUseCase.readAll(CharacterClass.None, race);
    }
    return results;
  }
}
