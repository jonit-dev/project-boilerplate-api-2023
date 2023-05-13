import { BadRequestError } from "@providers/errors/BadRequestError";
import { TS } from "@providers/translation/TranslationHelper";
import { FactionRepository } from "@repositories/ModuleCharacter/FactionRepository";
import { ICharacterTexture } from "@rpg-engine/shared";

import { provide } from "inversify-binding-decorators";

@provide(ReadFactionSpriteUseCase)
export class ReadFactionSpriteUseCase {
  constructor(private factionRepository: FactionRepository) {}

  public readAll(characterClass: string, race: string): ICharacterTexture[] {
    if (!characterClass || !race) {
      throw new BadRequestError(
        TS.translate("validation", "isNotEmpty", {
          field: !characterClass ? "class" : "race",
        })
      );
    }

    const textures = this.factionRepository.readSprites(characterClass, race);

    return textures;
  }
}
