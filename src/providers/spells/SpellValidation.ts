import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterClass, ISpell } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

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
