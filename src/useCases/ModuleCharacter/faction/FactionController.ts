import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { CharacterClass, ICharacterTexture } from "@rpg-engine/shared";
import { controller, httpGet, interfaces, queryParam } from "inversify-express-utils";
import { ReadCharacterClass } from "./read/ReadCharacterClass";
import { ReadFactionRacesUseCase } from "./read/ReadFactionRacesUseCase";
import { ReadFactionSpriteUseCase } from "./read/ReadFactionSpriteUseCase";

@controller("/factions", AuthMiddleware)
export class FactionController implements interfaces.Controller {
  constructor(
    private readFactionRacesUseCase: ReadFactionRacesUseCase,
    private readSpriteUseCase: ReadFactionSpriteUseCase
  ) {}

  @httpGet("/classes")
  private getFactionClasses(): string[] {
    return ReadCharacterClass.getPlayingCharacterClasses();
  }

  @httpGet("/races")
  private getFactionRaces(@queryParam("faction") faction: string): string[] {
    return this.readFactionRacesUseCase.readAll(faction);
  }

  @httpGet("/sprites")
  private getSprites(
    @queryParam("class") characterClass: string,
    @queryParam("race") race: string
  ): ICharacterTexture[] {
    let results = this.readSpriteUseCase.readAll(characterClass || CharacterClass.None, race);
    if (results.length < 1) {
      results = this.readSpriteUseCase.readAll(CharacterClass.None, race);
    }
    return results;
  }
}
