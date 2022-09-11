import { ICharacterTexture } from "@entities/ModuleCharacter/CharacterTextureModel";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { TS } from "@providers/translation/TranslationHelper";
import { FactionRepository } from "@repositories/ModuleCharacter/FactionRepository";
import { provide } from "inversify-binding-decorators";

@provide(ReadSpriteUseCase)
export class ReadSpriteUseCase {
  constructor(private factionRepository: FactionRepository) {}

  public async readAll(faction: string, race: string): Promise<ICharacterTexture[]> {
    if (!faction || !race) {
      throw new BadRequestError(
        TS.translate("validation", "isNotEmpty", {
          field: !faction ? "faction" : "race",
        })
      );
    }

    return await this.factionRepository.readSprites(faction, race);
  }
}
