import { ICharacterTexture } from "@entities/ModuleCharacter/CharacterTextureModel";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { TS } from "@providers/translation/TranslationHelper";
import { FactionRepository } from "@repositories/ModuleCharacter/FactionRepository";
import { provide } from "inversify-binding-decorators";

@provide(ReadSpriteUseCase)
export class ReadSpriteUseCase {
  constructor(private factionRepository: FactionRepository) {}

  public async readAll(clas: string, race: string): Promise<ICharacterTexture[]> {
    if (!clas || !race) {
      throw new BadRequestError(
        TS.translate("validation", "isNotEmpty", {
          field: !clas ? "class" : "race",
        })
      );
    }

    return await this.factionRepository.readSprites(clas, race);
  }
}
