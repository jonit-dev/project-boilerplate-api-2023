import { BadRequestError } from "@providers/errors/BadRequestError";
import { TS } from "@providers/translation/TranslationHelper";
import { CharacterFactions, LifeBringerRaces, ShadowWalkerRaces, TypeHelper } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ReadFactionRacesUseCase)
export class ReadFactionRacesUseCase {
  public readAll(faction: string): string[] {
    if (!faction) {
      throw new BadRequestError(
        TS.translate("validation", "isNotEmpty", {
          field: "faction",
        })
      );
    }

    if (faction === CharacterFactions.LifeBringer) {
      return TypeHelper.enumToStringArray(LifeBringerRaces);
    } else if (faction === CharacterFactions.ShadowWalker) {
      return TypeHelper.enumToStringArray(ShadowWalkerRaces);
    } else {
      throw new BadRequestError(
        TS.translate("validation", "notFound", {
          field: "faction",
        })
      );
    }
  }
}
