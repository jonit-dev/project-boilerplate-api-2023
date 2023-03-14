import { provide } from "inversify-binding-decorators";
import { ISpell } from "./data/types/SpellsBlueprintTypes";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterClass } from "@rpg-engine/shared";

@provide(SpellValidation)
export class SpellValidation {
  isAvailableForCharacterClass(spell: ISpell, character: ICharacter): boolean {
    return (
      !spell.characterClass ||
      spell.characterClass.length < 1 ||
      spell.characterClass.indexOf(character.class as CharacterClass) > -1
    );
  }
}
